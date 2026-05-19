import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

// Place order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!userId || items.length === 0 || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }
            return (
                (await acc) +
                (product.offerPrice || product.price) * item.quantity
            );
        }, 0);

        // Add tax 15%
        amount += Math.floor(amount * 0.15);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            status: "Order Placed",
        });

        res.status(200).json({
            success: true,
            message: "Order placed successfully",
        });
    } catch (error) {
        console.error("Error placing COD order:", error);
        res.status(500).json({ message: "Error placing COD order" });
    }
};

// Place order Online: /api/order/online
export const placeOrderOnline = async (req, res) => {
    console.log("Placing online order with data:", req.body); // Debug log to check incoming request data

    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!userId || items.length === 0 || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let productData = [];

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }

            productData.push({
                name: product.name,
                price:
                    product.offerPrice > 0 ? product.offerPrice : product.price,
                quantity: item.quantity,
            });

            return (
                (await acc) +
                (product.offerPrice || product.price) * item.quantity
            );
        }, 0);

        // Add tax 15%
        amount += Math.floor(amount * 0.15);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            status: "Payment Pending",
        });

        // Stripe gateway integration
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe checkout
        const lineItems = productData.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price + item.price * 0.15) * 100,
            },
            quantity: item.quantity,
        }));

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error placing Online order:", error);
        res.status(500).json({ message: "Error placing Online order" });
    }
};

// webhook to verify payments action: /api/order/verify-payment
export const verifyPayment = async (req, res) => {

    console.log("Received Stripe webhook:", req.body); // Debug log to check incoming webhook data
    // Stripe gateway integration
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body, // raw body is required to verify the webhook
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        console.error("Error verifying Stripe webhook:", err);
        return res.status(400).json({ message: "Webhook verification failed" });
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed": {
            // Handle successful checkout session
            const session = event.data.object;
            const { orderId, userId } = session.metadata;

            console.log(`Processing successful payment for order: ${orderId}`);

            try {
                // Mark payment as paid
                await Order.findByIdAndUpdate(orderId, {
                    isPaid: true,
                    status: "Order Placed",
                });
                // Clear user cart after successful payment
                await User.findByIdAndUpdate(userId, { cartItems: {} });

                console.log(`Order ${orderId} marked as paid and cart cleared`);
            } catch (error) {
                console.error("Error processing payment:", error);
            }
            break;
        }
        case "checkout.session.async_payment_succeeded": {
            // Handle async payment success (e.g., bank transfers)
            const session = event.data.object;
            const { orderId, userId } = session.metadata;

            console.log(`Processing async payment success for order: ${orderId}`);

            try {
                await Order.findByIdAndUpdate(orderId, {
                    isPaid: true,
                    status: "Order Placed",
                });

                await User.findByIdAndUpdate(userId, { cartItems: {} });
                console.log(`Order ${orderId} async payment succeeded`);
            } catch (error) {
                console.error("Error processing async payment:", error);
            }
            break;
        }
        case "checkout.session.async_payment_failed": {
            // Handle async payment failure
            const session = event.data.object;
            const { orderId } = session.metadata;

            console.log(`Payment failed for order: ${orderId}`);

            try {
                await Order.findByIdAndDelete(orderId);
                console.log(`Order ${orderId} deleted due to failed payment`);
            } catch (error) {
                console.error("Error deleting order:", error);
            }
            break;
        }
        default:
            console.log("Unhandled event type:", event.type);
            break;
    }
    res.status(200).json({ received: true });
};

// Get Orders by User ID: /api/order/user
export const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId" });
        }

        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" },
                { paymentType: "Online", isPaid: true },
            ],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

// Get all orders (for seller / admin): /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymentType: "COD" },
                { paymentType: "Online", isPaid: true },
            ],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: "Error fetching all orders" });
    }
};

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";
import { emitOrderChange } from "../configs/socket.js";

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

        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            status: "Order Placed",
        });

        const populatedOrder = await Order.findById(newOrder._id).populate("items.product address");
        emitOrderChange({ type: "NEW_ORDER", order: populatedOrder });

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

// Stripe instance & in-memory idempotency guard at module scope
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
const processedEvents = new Set();

const markOrderPaidAndClearCart = async (orderId, userId) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            isPaid: true,
            status: "Order Placed",
        },
        { new: true }
    ).populate("items.product address");
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    emitOrderChange({ type: "NEW_ORDER", order: updatedOrder });
};

export const verifyPayment = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // req.body MUST be the raw request body here (Buffer), not JSON-parsed.
        // Mount this route with express.raw({ type: "application/json" })
        // and make sure it's registered BEFORE any global express.json() middleware.
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        console.error("Error verifying Stripe webhook:", err.message);
        return res.status(400).json({ message: "Webhook verification failed" });
    }

    // Idempotency: Stripe may deliver the same event more than once
    if (processedEvents.has(event.id)) {
        console.log(`Skipping already-processed event: ${event.id}`);
        return res.status(200).json({ received: true });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const { orderId, userId } = session.metadata || {};

                if (!orderId || !userId) {
                    console.error(
                        "Missing orderId/userId in session metadata",
                        event.id,
                    );
                    break;
                }

                // For delayed payment methods (bank transfers etc.), "completed" fires
                // before the money actually arrives. Wait for the async event in that case.
                if (session.payment_status !== "paid") {
                    console.log(
                        `Order ${orderId} awaiting async payment confirmation`,
                    );
                    break;
                }

                await markOrderPaidAndClearCart(orderId, userId);
                console.log(`Order ${orderId} marked as paid and cart cleared`);
                break;
            }

            case "checkout.session.async_payment_succeeded": {
                const session = event.data.object;
                const { orderId, userId } = session.metadata || {};

                if (!orderId || !userId) {
                    console.error(
                        "Missing orderId/userId in session metadata",
                        event.id,
                    );
                    break;
                }

                await markOrderPaidAndClearCart(orderId, userId);
                console.log(`Order ${orderId} async payment succeeded`);
                break;
            }

            case "checkout.session.async_payment_failed": {
                const session = event.data.object;
                const { orderId } = session.metadata || {};

                if (!orderId) {
                    console.error("Missing orderId in session metadata", event.id);
                    break;
                }

                // Keep the record around instead of deleting it, for audit/history
                await Order.findByIdAndUpdate(orderId, {
                    status: "Payment Failed",
                });
                console.log(`Order ${orderId} marked as payment failed`);
                break;
            }

            default:
                console.log("Unhandled event type:", event.type);
                break;
        }

        // Add event.id only after successful event processing
        processedEvents.add(event.id);

        // Limit set size to prevent memory leaks over time
        if (processedEvents.size > 10000) {
            const first = processedEvents.values().next().value;
            processedEvents.delete(first);
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error(`Error processing webhook event ${event.id}:`, error);
        return res.status(500).json({ message: "Error processing webhook event" });
    }
};

// Get Orders by User ID: /api/order/user
export const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "Missing userId" });
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

// Update order status: /api/order/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true },
        ).populate("items.product address");

        if (!updatedOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }

        emitOrderChange({ type: "STATUS_UPDATED", order: updatedOrder });

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
        });
    }
};

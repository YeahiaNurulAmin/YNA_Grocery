import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import emptyCartIcon from "../assets/emptyCartIcon.svg";
import toast from "react-hot-toast";



const Cart = () => {

    const { currency, cartItems, setCartItems, products, navigate, removeFromCart, getCartAmount, addToCart, updateCartItem, user, axios } = useAppContext();
    const [cartArray, setCartArray] = React.useState([]);
    const [address, setAddress] = React.useState([]);
    const [showAddress, setShowAddress] = React.useState(false);
    const [selectedAddress, setSelectedAddress] = React.useState(null);
    const [paymentMethod, setPaymentMethod] = React.useState("COD");
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [itemsPrice, setItemsPrice] = React.useState(0);

    const handlePlaceOrder = async () => {
        try {
            if (!selectedAddress) {
                toast.error("Please select a delivery address");
                return;
            }

            if (paymentMethod === "COD") {
                const { data } = await axios.post("/api/order/cod", {
                    userId: user._id,
                    items: Object.entries(cartItems).map(([productId, quantity]) => ({ product: productId, quantity })),
                    address: selectedAddress._id,
                })

                if (data.success) {
                    toast.success("Order placed successfully");
                    setCartItems({});
                    navigate("/my-orders");
                } else {
                    toast.error("Failed to place order");
                    console.error("Error placing order:", data.message);
                }

            } else {
                const { data } = await axios.post("/api/order/online", {
                    userId: user._id,
                    items: Object.entries(cartItems).map(([productId, quantity]) => ({ product: productId, quantity })),
                    address: selectedAddress._id,
                })

                if (data.success) {
                    window.location.replace(data.url);
                } else {
                    toast.error("Failed to place order");
                    console.error("Error placing order:", data.message);
                }
            }
        } catch (error) {
            toast.error("Failed to place order");
            console.error("Error placing order:", error);

        }
    }

    const calculateItemsPrice = () => {
        let totalPrice = 0;
        for (let itemID in cartItems) {
            let foundProduct = products.find((product) => product._id === itemID);
            if (foundProduct) {
                totalPrice += foundProduct.offerPrice * cartItems[itemID];
            }
        }
        setItemsPrice(totalPrice);
    }

    const getCartProducts = () => {
        let cartData = [];

        for (let itemID in cartItems) {
            let foundProduct = products.find((product) => product._id === itemID);
            if (foundProduct) {
                let productInfo = structuredClone(foundProduct);
                productInfo.stockQuantity = foundProduct.quantity;
                productInfo.quantity = cartItems[itemID];
                cartData.push(productInfo);
            }
        }
        setCartArray(cartData);
    }

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get("/api/address/get", { userId: user._id });

            if (data.success) {
                setAddress(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error("Failed to fetch address");
            }

        } catch (error) {
            console.error("Error fetching user address:", error);
        }
    }

    useEffect(() => {
        if (products?.length > 0 && cartItems) {
            getCartProducts();
            calculateItemsPrice();
        }

    }, [products, cartItems, paymentMethod, address]);

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user]);




    const hasItemsInCart = cartItems && Object.keys(cartItems).length > 0;

    return products?.length > 0 && hasItemsInCart ? (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className="flex-1 max-w-4xl">
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart{" "}
                    <span className="text-sm text-primary">{Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                                onClick={() => { navigate(`/products/${product.category}/${product._id}`); scroll(0, 0) }}
                            >
                                <img
                                    className="max-w-full h-full object-cover"
                                    src={product.images[0]}
                                    alt={product.name}
                                />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">
                                    {product.name}
                                </p>
                                <div className="font-normal text-gray-500/70">
                                    <p>
                                        Weight:{" "}
                                        <span>{product.weight || "N/A"}</span>
                                    </p>
                                    <div className="flex items-center">
                                        <p>Qty:</p>
                                        <select
                                            className="outline-none"
                                            value={product.quantity}
                                            onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                                        >
                                            {Array(product.stockQuantity < 9 ? product.stockQuantity : 9)
                                                .fill("")
                                                .map((_, index) => (
                                                    <option
                                                        key={index}
                                                        value={index + 1}>
                                                        {index + 1}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">
                            {currency}{product.offerPrice * cartItems[product._id]}
                        </p>
                        <button className="cursor-pointer mx-auto text-accent-light hover:text-accent transition"
                            onClick={() => removeFromCart(product._id)}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                ))}

                <button className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium hover:text-primary-dark"
                    onClick={() => navigate("/products")}>
                    <svg
                        width="15"
                        height="11"
                        viewBox="0 0 15 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">
                    Order Summary
                </h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">
                        Delivery Address
                    </p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}` : "No address found"}</p>
                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full cursor-pointer z-10">
                                {address.map((address) => (<p
                                    onClick={() => { setShowAddress(false); setSelectedAddress(address) }}
                                    className="text-text-secondary p-2 hover:bg-gray-100 hover:text-text-primary">
                                    {address.street}, {address.city}, {address.state}
                                </p>))}
                                <p
                                    onClick={() => navigate("/add-address")}
                                    className="text-primary text-center cursor-pointer p-2 hover:text-primary-dark">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">
                        Payment Method
                    </p>

                    <div className="relative mt-2 w-full">
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full border border-gray-300 bg-white px-3 py-2 cursor-pointer flex justify-between items-center"
                        >
                            <span className="text-gray-600">{paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment"}</span>
                            <span className="text-gray-500 text-xs">▼</span>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 z-10 shadow-lg">
                                <div
                                    onClick={() => { setPaymentMethod("COD"); setIsDropdownOpen(false); }}
                                    className="px-3 py-2 cursor-pointer hover:bg-primary-light hover:text-white transition text-gray-600"
                                >
                                    Cash On Delivery
                                </div>
                                <div
                                    onClick={() => { setPaymentMethod("Online"); setIsDropdownOpen(false); }}
                                    className="px-3 py-2 cursor-pointer hover:bg-primary-light hover:text-white transition text-gray-600"
                                >
                                    Online Payment
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span>
                        <span>{currency}{itemsPrice}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (15%)</span>
                        <span>{currency}{Math.floor(itemsPrice * 0.15 * 100) / 100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span>
                        <span>{currency}{Math.floor(itemsPrice * 1.15 * 100) / 100}</span>
                    </p>
                </div>

                <button onClick={handlePlaceOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dark transition">
                    {paymentMethod === "COD" ? "Place Order" : "Proceed to Payment"}
                </button>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
            <img
                src={emptyCartIcon}
                alt="empty cart"
            />
            <h1 className="text-4xl font-medium text-gray-500 mt-6">
                Your cart is empty
            </h1>
            <p className="text-gray-500 mt-2">
                Looks like you have not added anything to your cart yet
            </p>
            <button
                className="mt-6 cursor-pointer flex items-center gap-2 text-primary font-medium hover:text-primary-dark"
                onClick={() => navigate("/products")}>
                <svg
                    width="15"
                    height="11"
                    viewBox="0 0 15 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                Continue Shopping
            </button>
        </div>
    );
};

export default Cart;

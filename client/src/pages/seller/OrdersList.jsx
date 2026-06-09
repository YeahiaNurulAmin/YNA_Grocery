import React, { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

const OrdersList = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = React.useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/seller");
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message || "Failed to fetch orders");
                console.error("Error fetching orders:", data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error("Error fetching orders:", error);
        }
    }

    const addDemoOrderHandler = () => {
        if (!dummyOrders || dummyOrders.length === 0) {
            toast.error("No dummy orders found");
            return;
        }
        
        // Pick a random dummy order
        const randomIndex = Math.floor(Math.random() * dummyOrders.length);
        const randomDummy = dummyOrders[randomIndex];
        
        // Clone it and give it a unique random ID
        const newDemoOrder = {
            ...structuredClone(randomDummy),
            _id: `demo_${Math.random().toString(36).substring(2, 11)}`,
            createdAt: new Date().toISOString(),
            isDemo: true // to identify it as a local/demo order
        };

        // Append to the beginning of orders state list
        setOrders(prev => [newDemoOrder, ...prev]);
        toast.success("Demo order added locally!");
    };

    const handleStatusChange = async (orderId, newStatus, isDemo) => {
        try {
            if (isDemo) {
                // If it is a demo order, only update the local state
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                toast.success("Demo order status updated locally!");
                return;
            }

            // Otherwise, make an API request to the backend
            const { data } = await axios.post("/api/order/status", { orderId, status: newStatus });
            if (data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                toast.success("Order status updated successfully!");
            } else {
                toast.error(data.message || "Failed to update order status");
            }
        } catch (error) {
            toast.error("Failed to update order status");
            console.error("Error updating order status:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [])

    // Filter only Active orders (not Delivered and not Cancelled)
    const activeOrders = orders.filter(order => order.status !== "Delivered" && order.status !== "Cancelled");

    // Helper for card styling based on order state
    const getCardStyle = (order) => {
        let base = "flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1.5fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border text-gray-800 shadow-sm relative overflow-hidden transition-all duration-300 ";
        
        if (order.status === "Shipped" || order.status === "Out for delivery") {
            base += "border-gray-200 border-l-4 border-l-amber-500 bg-white hover:shadow-md";
        } else if (order.status === "Packing") {
            base += "border-gray-200 border-l-4 border-l-indigo-400 bg-white hover:shadow-md";
        } else {
            base += "border-primary/30 border-l-4 border-l-primary bg-primary/5 hover:shadow-md";
        }
        
        return base;
    }

    const renderOrderCard = (order, index) => (
        <div key={order._id || index} className={getCardStyle(order)}>
            {order.isDemo && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-bl tracking-wider uppercase">
                    DEMO
                </div>
            )}
            
            <div className="flex gap-5">
                <img className="w-12 h-12 object-cover opacity-60" src={assets.box_icon} alt="boxIcon" />
                <div className="flex flex-col justify-center gap-2">
                    {order.items?.map((item, itemIdx) => (
                        <div key={itemIdx}>
                            <p className="font-bold text-gray-900">
                                {item.product?.name || "Unknown Product"} 
                                <span className={`text-primary ${item.quantity < 2 && "hidden"}`}> x {item.quantity}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p className='font-bold text-gray-900 mb-1'>
                    {order.address?.firstName || "N/A"} {order.address?.lastName || ""}
                </p>
                <p>{order.address?.street || ""}, {order.address?.city || ""}</p>
                <p>{order.address?.state || ""}, {order.address?.zipCode || order.address?.zipcode || ""}, {order.address?.country || ""}</p>
                <p className="mt-1 text-xs">Phone: {order.address?.phone || ""}</p>
            </div>

            <p className="font-semibold text-lg text-primary">{currency}{order.amount}</p>

            <div className="flex flex-col text-sm text-gray-600 gap-1.5">
                <p><span className="font-medium">Method:</span> {order.paymentType}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Payment:</span> <span className={order.isPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>{order.isPaid ? "Paid" : "Pending"}</span></p>
                
                <div className="mt-2">
                    <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Order Status</label>
                    <select
                        value={order.status || "Order Placed"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value, order.isDemo)}
                        className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-white focus:border-primary focus:ring-1 focus:ring-primary w-full text-gray-700 font-semibold cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
                    >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
        </div>
    );

    return (
        <div className="md:p-10 p-4 space-y-8 no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-surface/10">
            {/* Active Orders Header */}
            <div className="flex items-center justify-between max-w-4xl pb-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-primary">Active Orders ({activeOrders.length})</h2>
                <button
                    onClick={addDemoOrderHandler}
                    className="cursor-pointer bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition text-sm flex items-center gap-1.5 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Demo Order
                </button>
            </div>

            {/* Active Orders List */}
            <div className="space-y-4">
                {activeOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 font-medium max-w-4xl border border-dashed border-gray-300 rounded-lg">
                        No active orders found. Update a history order or create a new demo order.
                    </div>
                ) : (
                    activeOrders.map((order, index) => renderOrderCard(order, index))
                )}
            </div>
        </div>
    );
}

export default OrdersList;

import React, { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

const OrdersList = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = React.useState([]);
    const [statusFilter, setStatusFilter] = React.useState("All");

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

    // Filter by the selected status filter
    const filteredActiveOrders = activeOrders.filter(order => {
        if (statusFilter === "All") return true;
        return order.status === statusFilter;
    });

    // Helper for card styling based on order state
    const getCardStyle = (status) => {
        let base = "flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1.5fr] md:items-center gap-5 p-5 max-w-4xl rounded-lg border text-gray-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md ";
        
        if (status === "Packing") {
            base += "border-purple-200 border-l-4 border-l-purple-500 bg-purple-50/20";
        } else if (status === "Shipped") {
            base += "border-amber-200 border-l-4 border-l-amber-500 bg-amber-50/15";
        } else if (status === "Out for delivery") {
            base += "border-teal-200 border-l-4 border-l-teal-500 bg-teal-50/15";
        } else {
            // Order Placed / Default
            base += "border-blue-200 border-l-4 border-l-blue-500 bg-blue-50/20";
        }
        
        return base;
    }

    const getStatusBadge = (status) => {
        if (status === "Packing") {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block animate-pulse"></span>
                    Packing
                </span>
            );
        } else if (status === "Shipped") {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                    Shipped
                </span>
            );
        } else if (status === "Out for delivery") {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block animate-ping"></span>
                    Out for Delivery
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                    Placed
                </span>
            );
        }
    }

    const renderOrderCard = (order, index) => (
        <div key={order._id || index} className={getCardStyle(order.status)}>
            {order.isDemo && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-bl tracking-wider uppercase shadow-sm">
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
                                <span className={`text-primary font-bold ${item.quantity < 2 && "hidden"}`}> x {item.quantity}</span>
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

            <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-lg text-primary">{currency}{order.amount}</p>
                <div className="mt-0.5">
                    {getStatusBadge(order.status || "Order Placed")}
                </div>
            </div>

            <div className="flex flex-col text-sm text-gray-600 gap-1.5">
                <p><span className="font-medium">Method:</span> {order.paymentType}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Payment:</span> <span className={order.isPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>{order.isPaid ? "Paid" : "Pending"}</span></p>
                
                <div className="mt-2">
                    <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Update Status</label>
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
        <div className="space-y-6 animate-fade-in max-w-5xl">
            {/* Active Orders Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-text-primary">Active Orders ({activeOrders.length})</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage and update active incoming orders</p>
                </div>
                <button
                    onClick={addDemoOrderHandler}
                    className="cursor-pointer bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-[16px] transition text-sm flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Demo Order
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 bg-surface-muted p-1.5 rounded-[16px] border border-border">
                {[
                    { id: "All", label: "All Active", count: activeOrders.length },
                    { id: "Order Placed", label: "Placed", count: activeOrders.filter(o => o.status === "Order Placed" || !o.status).length },
                    { id: "Packing", label: "Packing", count: activeOrders.filter(o => o.status === "Packing").length },
                    { id: "Shipped", label: "Shipped", count: activeOrders.filter(o => o.status === "Shipped").length },
                    { id: "Out for delivery", label: "Out for Delivery", count: activeOrders.filter(o => o.status === "Out for delivery").length }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                            statusFilter === tab.id
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-600 hover:text-gray-900 hover:bg-white/40"
                        }`}
                    >
                        {tab.label}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            statusFilter === tab.id
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-200 text-gray-600"
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Active Orders List */}
            <div className="space-y-4">
                {filteredActiveOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-medium max-w-4xl border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No {statusFilter === "All" ? "active" : `"${statusFilter}"`} orders found.</p>
                    </div>
                ) : (
                    filteredActiveOrders.map((order, index) => renderOrderCard(order, index))
                )}
            </div>
        </div>
    );
}

export default OrdersList;
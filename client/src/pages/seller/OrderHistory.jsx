import React, { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

const OrderHistory = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("date-desc");
    const [loading, setLoading] = React.useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/order/seller");
            if (data.success) {
                // Filter only Delivered and Cancelled orders
                const historyOrders = data.orders.filter(
                    order => order.status === "Delivered" || order.status === "Cancelled"
                );
                setOrders(historyOrders);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter by search query (name, email, phone, order ID)
    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase().trim();

        const fullName = `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.toLowerCase();
        const email = (order.address?.email || "").toLowerCase();
        const phone = (order.address?.phone || "").toLowerCase();
        const id = (order._id || "").toLowerCase();

        return fullName.includes(query) ||
               email.includes(query) ||
               phone.includes(query) ||
               id.includes(query);
    });

    // Sort
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortBy === "date-desc") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "date-asc") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "amount-desc") return b.amount - a.amount;
        if (sortBy === "amount-asc") return a.amount - b.amount;
        return 0;
    });

    const getStatusBadge = (status) => {
        if (status === "Delivered") {
            return (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    Delivered
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                Cancelled
            </span>
        );
    };

    const renderOrderCard = (order, index) => (
        <div
            key={order._id || index}
            className={`flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border bg-white text-gray-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                order.status === "Delivered"
                    ? "border-l-4 border-l-green-500 border-gray-200"
                    : "border-l-4 border-l-red-400 border-gray-200 opacity-90 hover:opacity-100"
            }`}
        >
            <div className="flex gap-5">
                <img className="w-12 h-12 object-cover opacity-60" src={assets.box_icon} alt="boxIcon" />
                <div className="flex flex-col justify-center gap-2">
                    {order.items?.map((item, itemIdx) => (
                        <div key={itemIdx}>
                            <p className="font-bold text-gray-900">
                                {item.product?.name || "Unknown Product"}
                                <span className={`text-primary ml-1 ${item.quantity < 2 && "hidden"}`}>x {item.quantity}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-bold text-gray-900 mb-1">
                    {order.address?.firstName || "N/A"} {order.address?.lastName || ""}
                </p>
                <p>{order.address?.street || ""}, {order.address?.city || ""}</p>
                <p>{order.address?.state || ""}, {order.address?.zipCode || order.address?.zipcode || ""}, {order.address?.country || ""}</p>
                <p className="mt-1 text-xs">Phone: {order.address?.phone || ""}</p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-semibold text-lg text-primary">{currency}{order.amount}</p>
                <p className="text-xs text-gray-500"><span className="font-medium">Method:</span> {order.paymentType}</p>
                <p className="text-xs text-gray-500"><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs"><span className="font-medium">Payment:</span>{" "}
                    <span className={order.isPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                        {order.isPaid ? "Paid" : "Pending"}
                    </span>
                </p>
            </div>

            <div className="flex flex-col gap-2 items-start">
                {getStatusBadge(order.status)}
                <p className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]" title={order._id}>
                    ID: {order._id?.slice(-8) || "—"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="md:p-10 p-4 space-y-6 no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-surface/10">
            {/* Header */}
            <div className="max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-primary">Order History</h2>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                            All delivered & cancelled orders
                            {!loading && (
                                <span className="ml-2 bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[11px]">
                                    {orders.length} total
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="outline-none border border-gray-300 rounded-md pl-8 pr-8 py-1.5 text-xs bg-white focus:border-primary focus:ring-1 focus:ring-primary w-full text-gray-700 font-medium shadow-sm transition"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="outline-none border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-white focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 font-semibold cursor-pointer shadow-sm hover:border-gray-400 transition"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Amount: High to Low</option>
                            <option value="amount-asc">Amount: Low to High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            {!loading && orders.length > 0 && (
                <div className="flex gap-4 max-w-4xl">
                    <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-green-700">
                            {orders.filter(o => o.status === "Delivered").length}
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-0.5">Delivered</p>
                    </div>
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-red-600">
                            {orders.filter(o => o.status === "Cancelled").length}
                        </p>
                        <p className="text-xs text-red-500 font-medium mt-0.5">Cancelled</p>
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-gray-700">
                            {currency}{orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Revenue (Delivered)</p>
                    </div>
                </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 font-medium max-w-4xl">
                        Loading order history...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-medium max-w-4xl border border-dashed border-gray-300 rounded-lg flex flex-col items-center gap-3">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p>No completed or cancelled orders yet.</p>
                        <p className="text-xs text-gray-400">Orders marked as Delivered or Cancelled will appear here.</p>
                    </div>
                ) : sortedOrders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 font-medium max-w-4xl border border-dashed border-gray-300 rounded-lg">
                        No orders match "<span className="text-primary font-semibold">{searchQuery}</span>".
                    </div>
                ) : (
                    sortedOrders.map((order, index) => renderOrderCard(order, index))
                )}
            </div>
        </div>
    );
};

export default OrderHistory;

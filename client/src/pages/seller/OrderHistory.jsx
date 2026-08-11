import React, { useEffect, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import { socket } from '../../configs/socket';

const OrderHistory = () => {
    const { currency, axios } = useAppContext();
    const { t, isRTL, formatPrice } = useLanguage();
    const [orders, setOrders] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("date-desc");
    const [loading, setLoading] = React.useState(true);

    const fetchOrders = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            const { data } = await axios.get("/api/order/seller");
            if (data.success) {
                const historyOrders = data.orders.filter(
                    order => order.status === "Delivered" || order.status === "Cancelled"
                );
                setOrders(historyOrders);
            } else if (!isSilent) {
                toast.error(data.message || t("seller.couldnt_load_orders"));
            }
        } catch (error) {
            if (!isSilent) toast.error(t("seller.couldnt_load_orders"));
            console.error("Error fetching orders:", error);
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, [axios, t]);

    useEffect(() => {
        fetchOrders(false);

        const handleRealtimeUpdate = () => {
            fetchOrders(true);
        };

        socket.on("orders_updated", handleRealtimeUpdate);
        socket.on("new_order", handleRealtimeUpdate);
        window.addEventListener("yna_orders_updated", handleRealtimeUpdate);

        const interval = setInterval(() => {
            fetchOrders(true);
        }, 5000);

        return () => {
            socket.off("orders_updated", handleRealtimeUpdate);
            socket.off("new_order", handleRealtimeUpdate);
            window.removeEventListener("yna_orders_updated", handleRealtimeUpdate);
            clearInterval(interval);
        };
    }, [fetchOrders]);

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
                    {t("status.delivered")}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                {t("status.cancelled")}
            </span>
        );
    };

    const renderOrderCard = (order, index) => (
        <div
            key={order._id || index}
            className={`flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border bg-bg-white text-text-primary shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                order.status === "Delivered"
                    ? "border-l-4 border-l-green-500 border-border"
                    : "border-l-4 border-l-red-400 border-border opacity-90 hover:opacity-100"
            }`}
        >
            <div className="flex gap-5">
                <img className="w-12 h-12 object-cover opacity-60" src={assets.box_icon} alt="boxIcon" />
                <div className="flex flex-col justify-center gap-2">
                    {order.items?.map((item, itemIdx) => (
                        <div key={itemIdx}>
                            <p className="font-bold text-text-primary">
                                {item.product?.name || "Product"}
                                <span className={`text-primary mx-1 ${item.quantity < 2 && "hidden"}`}>x {item.quantity}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-sm text-text-secondary">
                <p className="font-bold text-text-primary mb-1">
                    {order.address?.firstName || "N/A"} {order.address?.lastName || ""}
                </p>
                <p>{order.address?.street || ""}, {order.address?.city || ""}</p>
                <p>{order.address?.state || ""}, {order.address?.zipCode || order.address?.zipcode || ""}, {order.address?.country || ""}</p>
                <p className="mt-1 text-xs">{t("addaddress.phone")}: {order.address?.phone || ""}</p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-semibold text-lg text-primary">{formatPrice(order.amount, currency)}</p>
                <p className="text-xs text-text-tertiary"><span className="font-medium">{t("seller.action")}:</span> {order.paymentType || t("payment.cod")}</p>
                <p className="text-xs text-text-tertiary"><span className="font-medium">{t("seller.date")}:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs"><span className="font-medium">{t("seller.status")}:</span>{" "}
                    <span className={order.isPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                        {order.isPaid ? (isRTL ? "تم الدفع" : "Paid") : (isRTL ? "قيد الانتظار" : "Pending")}
                    </span>
                </p>
            </div>

            <div className="flex flex-col gap-2 items-start">
                {getStatusBadge(order.status)}
                <p className="text-[10px] text-text-tertiary font-mono truncate max-w-[140px]" title={order._id}>
                    ID: {order._id?.slice(-8) || "—"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl">
            {/* Header */}
            <div className="max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div>
                        <h2 className="text-xl font-semibold text-primary">{t("seller.order_history")}</h2>
                        <p className="text-xs text-text-secondary font-medium mt-0.5">
                            {t("myorder.subtitle")}
                            {!loading && (
                                <span className="mx-2 bg-surface-muted text-text-secondary font-bold px-2 py-0.5 rounded-full text-[11px]">
                                    {orders.length}
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder={t("nav.search_placeholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`outline-none border border-border rounded-md ${isRTL ? "pr-8 pl-8" : "pl-8 pr-8"} py-1.5 text-xs bg-bg-white focus:border-primary focus:ring-1 focus:ring-primary w-full text-text-primary font-medium shadow-sm transition`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className={`absolute ${isRTL ? "left-2.5" : "right-2.5"} top-2.5 text-text-tertiary hover:text-text-primary transition`}
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
                            className="outline-none border border-border rounded-md px-3 py-1.5 text-xs bg-bg-white focus:border-primary focus:ring-1 focus:ring-primary text-text-primary font-semibold cursor-pointer shadow-sm transition"
                        >
                            <option value="date-desc">{t("filters.sort_newest")}</option>
                            <option value="date-asc">{isRTL ? "الأقدم أولاً" : "Oldest First"}</option>
                            <option value="amount-desc">{t("filters.sort_high_low")}</option>
                            <option value="amount-asc">{t("filters.sort_low_high")}</option>
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
                        <p className="text-xs text-green-600 font-medium mt-0.5">{t("status.delivered")}</p>
                    </div>
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-red-600">
                            {orders.filter(o => o.status === "Cancelled").length}
                        </p>
                        <p className="text-xs text-red-500 font-medium mt-0.5">{t("status.cancelled")}</p>
                    </div>
                    <div className="flex-1 bg-surface-muted border border-border rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-text-primary">
                            {formatPrice(orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.amount, 0), currency)}
                        </p>
                        <p className="text-xs text-text-secondary font-medium mt-0.5">{t("seller.total_sales")}</p>
                    </div>
                </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-text-tertiary font-medium max-w-4xl">
                        ...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-text-tertiary font-medium max-w-4xl border border-dashed border-border rounded-lg flex flex-col items-center gap-3">
                        <svg className="w-10 h-10 text-text-placeholder" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p>{t("orders.no_orders")}</p>
                    </div>
                ) : sortedOrders.length === 0 ? (
                    <div className="text-center py-10 text-text-tertiary font-medium max-w-4xl border border-dashed border-border rounded-lg">
                        {t("search.no_matches")} "<span className="text-primary font-semibold">{searchQuery}</span>".
                    </div>
                ) : (
                    sortedOrders.map((order, index) => renderOrderCard(order, index))
                )}
            </div>
        </div>
    );
};

export default OrderHistory;

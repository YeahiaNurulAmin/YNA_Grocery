import React, { useEffect, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';
import { socket } from '../../configs/socket';

const OrdersList = () => {
    const { currency, axios } = useAppContext();
    const { t, isRTL, formatPrice } = useLanguage();
    const [orders, setOrders] = React.useState([]);
    const [statusFilter, setStatusFilter] = React.useState("All");

    const fetchOrders = useCallback(async (isSilent = false) => {
        try {
            const { data } = await axios.get("/api/order/seller");
            if (data.success) {
                setOrders(data.orders);
            } else if (!isSilent) {
                toast.error(data.message || t("seller.couldnt_load_orders"));
                console.error("Error fetching orders:", data.message);
            }
        } catch (error) {
            if (!isSilent) {
                toast.error(t("seller.couldnt_load_orders"));
            }
            console.error("Error fetching orders:", error);
        }
    }, [axios, t]);

    const addDemoOrderHandler = () => {
        if (!dummyOrders || dummyOrders.length === 0) {
            toast.error(t("seller.no_dummy_orders"));
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * dummyOrders.length);
        const randomDummy = dummyOrders[randomIndex];
        
        const newDemoOrder = {
            ...structuredClone(randomDummy),
            _id: `demo_${Math.random().toString(36).substring(2, 11)}`,
            createdAt: new Date().toISOString(),
            isDemo: true
        };

        setOrders(prev => [newDemoOrder, ...prev]);
        toast.success(t("seller.demo_order_added"));
    };

    const handleStatusChange = async (orderId, newStatus, isDemo) => {
        try {
            if (isDemo) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                toast.success(t("seller.demo_order_updated"));
                return;
            }

            const { data } = await axios.post("/api/order/status", { orderId, status: newStatus });
            if (data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                toast.success(t("seller.order_status_updated"));
            } else {
                toast.error(data.message || t("seller.order_status_error"));
            }
        } catch (error) {
            toast.error(t("seller.order_status_error"));
            console.error("Error updating order status:", error);
        }
    };

    useEffect(() => {
        fetchOrders();

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

    const activeOrders = orders.filter(order => order.status !== "Delivered" && order.status !== "Cancelled");

    const filteredActiveOrders = activeOrders.filter(order => {
        if (statusFilter === "All") return true;
        return order.status === statusFilter;
    });

    const getCardStyle = (status) => {
        let base = "flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1.5fr] md:items-center gap-5 p-5 max-w-4xl rounded-lg border text-text-primary shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md ";
        
        if (status === "Packing") {
            base += "border-purple-200 border-l-4 border-l-purple-500 bg-purple-50/20";
        } else if (status === "Shipped") {
            base += "border-amber-200 border-l-4 border-l-amber-500 bg-amber-50/15";
        } else if (status === "Out for delivery") {
            base += "border-teal-200 border-l-4 border-l-teal-500 bg-teal-50/15";
        } else {
            base += "border-blue-200 border-l-4 border-l-blue-500 bg-blue-50/20";
        }
        
        return base;
    }

    const getStatusBadge = (status) => {
        if (status === "Packing") {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block animate-pulse"></span>
                    {t("status.packing")}
                </span>
            );
        } else if (status === "Shipped") {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                    {t("status.shipped")}
                </span>
            );
        } else if (status === "Out for delivery") {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block animate-ping"></span>
                    {t("status.out_for_delivery")}
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                    {t("status.order_placed")}
                </span>
            );
        }
    }

    const renderOrderCard = (order, index) => (
        <div key={order._id || index} className={getCardStyle(order.status)}>
            {order.isDemo && (
                <div className={`absolute top-0 ${isRTL ? "left-0 rounded-br" : "right-0 rounded-bl"} bg-primary text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase shadow-sm`}>
                    DEMO
                </div>
            )}
            
            <div className="flex gap-5">
                <img className="w-12 h-12 object-cover opacity-60" src={assets.box_icon} alt="boxIcon" />
                <div className="flex flex-col justify-center gap-2">
                    {order.items?.map((item, itemIdx) => (
                        <div key={itemIdx}>
                            <p className="font-bold text-text-primary">
                                {item.product?.name || "Product"} 
                                <span className={`text-primary font-bold ${item.quantity < 2 && "hidden"}`}> x {item.quantity}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-sm text-text-secondary">
                <p className='font-bold text-text-primary mb-1'>
                    {order.address?.firstName || "N/A"} {order.address?.lastName || ""}
                </p>
                <p>{order.address?.street || ""}, {order.address?.city || ""}</p>
                <p>{order.address?.state || ""}, {order.address?.zipCode || order.address?.zipcode || ""}, {order.address?.country || ""}</p>
                <p className="mt-1 text-xs">{t("addaddress.phone")}: {order.address?.phone || ""}</p>
            </div>

            <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-lg text-primary">{formatPrice(order.amount, currency)}</p>
                <div className="mt-0.5">
                    {getStatusBadge(order.status || "Order Placed")}
                </div>
            </div>

            <div className="flex flex-col text-sm text-text-secondary gap-1.5">
                <p><span className="font-medium">{t("seller.action")}:</span> {order.paymentType || t("payment.cod")}</p>
                <p><span className="font-medium">{t("seller.date")}:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">{t("seller.status")}:</span> <span className={order.isPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>{order.isPaid ? (isRTL ? "تم الدفع" : "Paid") : (isRTL ? "قيد الانتظار" : "Pending")}</span></p>
                
                <div className="mt-2">
                    <label className="text-[11px] font-bold text-text-tertiary block mb-1 uppercase tracking-wider">{t("seller.status")}</label>
                    <select
                        value={order.status || "Order Placed"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value, order.isDemo)}
                        className="outline-none border border-border rounded-md px-2.5 py-1.5 text-xs bg-bg-white focus:border-primary focus:ring-1 focus:ring-primary w-full text-text-primary font-semibold cursor-pointer shadow-sm transition-colors"
                    >
                        <option value="Order Placed">{t("status.order_placed")}</option>
                        <option value="Packing">{t("status.packing")}</option>
                        <option value="Shipped">{t("status.shipped")}</option>
                        <option value="Out for delivery">{t("status.out_for_delivery")}</option>
                        <option value="Delivered">{t("status.delivered")}</option>
                        <option value="Cancelled">{t("status.cancelled")}</option>
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
                    <h2 className="font-heading text-2xl font-bold text-text-primary">{t("seller.pending_orders")} ({activeOrders.length})</h2>
                    <p className="text-sm text-text-secondary mt-1">{t("seller.recent_orders")}</p>
                </div>
                <button
                    onClick={addDemoOrderHandler}
                    className="cursor-pointer bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-[16px] transition text-sm flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    + {t("seller.demo_order")}
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 bg-surface-muted p-1.5 rounded-[16px] border border-border">
                {[
                    { id: "All", label: t("filters.rating_any"), count: activeOrders.length },
                    { id: "Order Placed", label: t("status.order_placed"), count: activeOrders.filter(o => o.status === "Order Placed" || !o.status).length },
                    { id: "Packing", label: t("status.packing"), count: activeOrders.filter(o => o.status === "Packing").length },
                    { id: "Shipped", label: t("status.shipped"), count: activeOrders.filter(o => o.status === "Shipped").length },
                    { id: "Out for delivery", label: t("status.out_for_delivery"), count: activeOrders.filter(o => o.status === "Out for delivery").length }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                            statusFilter === tab.id
                                ? "bg-bg-white text-primary shadow-sm"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-white/40"
                        }`}
                    >
                        {tab.label}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            statusFilter === tab.id
                                ? "bg-primary/10 text-primary"
                                : "bg-border text-text-tertiary"
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Active Orders List */}
            <div className="space-y-4">
                {filteredActiveOrders.length === 0 ? (
                    <div className="text-center py-12 text-text-tertiary font-medium max-w-4xl border border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3">
                        <svg className="w-10 h-10 text-text-placeholder" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>{t("orders.no_orders")}</p>
                    </div>
                ) : (
                    filteredActiveOrders.map((order, index) => renderOrderCard(order, index))
                )}
            </div>
        </div>
    );
}

export default OrdersList;
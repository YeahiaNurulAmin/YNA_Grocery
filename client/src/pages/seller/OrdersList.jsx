import React, { useEffect, useCallback } from 'react'
import { Calendar, CreditCard, MapPin, Phone, ShoppingBag, Plus } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';
import { socket } from '../../configs/socket';
import { OrderStatusDropdown } from '../../components/seller/OrderStatusDropdown';

const getProductImage = (product) => {
    if (!product) return assets.box_icon;
    if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
    if (Array.isArray(product.image) && product.image.length > 0) return product.image[0];
    if (typeof product.images === "string" && product.images) return product.images;
    if (typeof product.image === "string" && product.image) return product.image;
    return assets.box_icon;
};

const OrdersList = () => {
    const { currency, axios } = useAppContext();
    const { t, tCategory, isRTL, formatPrice } = useLanguage();
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
    };

    const renderOrderCard = (order, index) => {
        const totalItemsCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

        return (
            <div 
                key={order._id || index} 
                className={`rounded-[20px] border bg-bg-white text-text-primary shadow-sm hover:shadow-md transition-all duration-300 relative ${
                    order.status === "Packing"
                        ? "border-purple-200/80 bg-gradient-to-b from-purple-50/20 to-bg-white"
                        : order.status === "Shipped"
                        ? "border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-bg-white"
                        : order.status === "Out for delivery"
                        ? "border-teal-200/80 bg-gradient-to-b from-teal-50/20 to-bg-white"
                        : "border-blue-200/80 bg-gradient-to-b from-blue-50/20 to-bg-white"
                }`}
            >
                {order.isDemo && (
                    <div className={`absolute top-0 ${isRTL ? "left-0 rounded-tl-[19px] rounded-br-[12px]" : "right-0 rounded-tr-[19px] rounded-bl-[12px]"} bg-primary text-white text-[10px] font-bold px-3 py-1 tracking-wider uppercase shadow-sm z-10`}>
                        DEMO
                    </div>
                )}

                {/* Card Header: Order ID, Date, Payment & Status Badges */}
                <div className="p-4 sm:p-5 border-b border-border/70 flex flex-wrap items-center justify-between gap-3 bg-surface-muted/30">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-bg-white border border-border px-2.5 py-1 rounded-[10px] text-text-primary shadow-2xs">
                                #{order._id?.slice(-8) || "—"}
                            </span>
                            <span className="text-xs text-text-tertiary flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-muted border border-border text-text-secondary flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            {order.paymentType === "COD" ? t("payment.cod") : t("payment.stripe")}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            order.isPaid
                                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                            {order.isPaid ? t("seller.paid") : t("seller.pending")}
                        </span>
                        {getStatusBadge(order.status || "Order Placed")}
                    </div>
                </div>

                {/* Products Details List */}
                <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between pb-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                            {t("seller.items_count")} ({totalItemsCount})
                        </h4>
                    </div>

                    <div className="space-y-2.5">
                        {order.items?.map((item, itemIdx) => {
                            const product = item.product || {};
                            const imgSrc = getProductImage(product);
                            const unitPrice = product.offerPrice && product.offerPrice > 0 ? product.offerPrice : (product.price || 0);
                            const qty = item.quantity || 1;
                            const lineTotal = unitPrice * qty;

                            return (
                                <div 
                                    key={item._id || itemIdx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[14px] bg-surface-muted/40 border border-border/60 hover:bg-surface-muted/70 transition-colors"
                                >
                                    {/* Image + Product Details */}
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[12px] bg-bg-white border border-border/80 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                            <img
                                                src={imgSrc}
                                                alt={product.name || "Product"}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.currentTarget.src = assets.box_icon; }}
                                            />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <h5 className="font-heading font-bold text-text-primary text-sm sm:text-base leading-snug truncate max-w-[260px] sm:max-w-md">
                                                {product.name || "Product"}
                                            </h5>
                                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                                {product.category && (
                                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-light-mint text-primary">
                                                        {tCategory(product.category)}
                                                    </span>
                                                )}
                                                {product.weight && (
                                                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-muted border border-border/60 text-text-secondary">
                                                        {product.weight}
                                                    </span>
                                                )}
                                                {product.inStock !== undefined && (
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                                        product.inStock ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
                                                    }`}>
                                                        {product.inStock ? t("seller.in_stock") : t("seller.out_of_stock")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Quantity Breakdown */}
                                    <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0 text-sm">
                                        <div className="text-left sm:text-right">
                                            <p className="text-xs text-text-tertiary">{t("seller.unit_price")}</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-text-primary">{formatPrice(unitPrice, currency)}</span>
                                                {product.offerPrice && product.offerPrice < product.price && (
                                                    <span className="text-xs line-through text-text-tertiary">
                                                        {formatPrice(product.price, currency)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-right px-2.5 py-1 rounded-[10px] bg-bg-white border border-border/80">
                                            <span className="text-xs text-text-tertiary block">{t("seller.qty")}</span>
                                            <span className="font-bold text-primary text-sm">× {qty}</span>
                                        </div>
                                        <div className="text-right min-w-[70px]">
                                            <p className="text-xs text-text-tertiary">{t("seller.subtotal")}</p>
                                            <p className="font-bold text-text-primary text-sm">{formatPrice(lineTotal, currency)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section: Address, Order Total & Status Update */}
                <div className="p-4 sm:p-5 bg-surface-muted/30 border-t border-border/70 grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {/* Customer Shipping Address */}
                    <div className="text-xs text-text-secondary space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-text-primary text-sm">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span>{order.address?.firstName || "Customer"} {order.address?.lastName || ""}</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed pl-5">
                            {order.address?.street ? `${order.address.street}, ` : ""}
                            {order.address?.city ? `${order.address.city}, ` : ""}
                            {order.address?.state ? `${order.address.state}, ` : ""}
                            {order.address?.zipCode || order.address?.zipcode || ""}
                            {order.address?.country ? `, ${order.address.country}` : ""}
                        </p>
                        {order.address?.phone && (
                            <p className="text-xs text-text-primary flex items-center gap-1.5 font-medium pl-5">
                                <Phone className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                                {order.address.phone}
                            </p>
                        )}
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-1 md:border-x md:border-border/60 md:px-5">
                        <div className="flex justify-between items-center text-xs text-text-secondary">
                            <span>{t("seller.total_amount")}:</span>
                            <span className="font-bold text-lg text-primary">{formatPrice(order.amount, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-text-tertiary">
                            <span>{t("seller.payment_method")}:</span>
                            <span className="font-medium text-text-secondary">{order.paymentType || t("payment.cod")}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-text-tertiary">
                            <span>{t("seller.payment_status")}:</span>
                            <span className={order.isPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                                {order.isPaid ? t("seller.paid") : t("seller.pending")}
                            </span>
                        </div>
                    </div>

                    {/* Status Changer */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary block">
                            {t("seller.change_status")}
                        </label>
                        <OrderStatusDropdown
                            currentStatus={order.status || "Order Placed"}
                            onStatusChange={(newStatus) => handleStatusChange(order._id, newStatus, order.isDemo)}
                        />
                    </div>
                </div>
            </div>
        );
    };

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
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    {t("seller.demo_order")}
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
                        <ShoppingBag className="w-10 h-10 text-text-placeholder" strokeWidth={1.5} />
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
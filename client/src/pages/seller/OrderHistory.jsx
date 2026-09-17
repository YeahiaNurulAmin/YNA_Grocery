import React, { useEffect, useCallback } from 'react'
import { Calendar, CreditCard, MapPin, Phone, ShoppingBag } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import { socket } from '../../configs/socket';

const getProductImage = (product) => {
    if (!product) return assets.box_icon;
    if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
    if (Array.isArray(product.image) && product.image.length > 0) return product.image[0];
    if (typeof product.images === "string" && product.images) return product.images;
    if (typeof product.image === "string" && product.image) return product.image;
    return assets.box_icon;
};

const OrderHistory = () => {
    const { currency, axios } = useAppContext();
    const { t, tCategory, isRTL, formatPrice } = useLanguage();
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
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    {t("status.delivered")}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                {t("status.cancelled")}
            </span>
        );
    };

    const renderOrderCard = (order, index) => {
        const totalItemsCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

        return (
            <div
                key={order._id || index}
                className={`rounded-[20px] border bg-bg-white text-text-primary shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden ${
                    order.status === "Delivered"
                        ? "border-green-200/80 bg-gradient-to-b from-green-50/20 to-bg-white"
                        : "border-red-200/80 bg-gradient-to-b from-red-50/20 to-bg-white"
                }`}
            >
                {/* Card Header */}
                <div className="p-4 sm:p-5 border-b border-border/70 flex flex-wrap items-center justify-between gap-3 bg-surface-muted/30">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-mono font-bold bg-bg-white border border-border px-2.5 py-1 rounded-[10px] text-text-primary shadow-2xs">
                            #{order._id?.slice(-8) || "—"}
                        </span>
                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
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
                        {getStatusBadge(order.status)}
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

                {/* Bottom Section: Address & Order Total */}
                <div className="p-4 sm:p-5 bg-surface-muted/30 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
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
                    <div className="space-y-1 sm:text-right">
                        <div className="flex sm:justify-end justify-between items-center gap-3 text-xs text-text-secondary">
                            <span>{t("seller.total_amount")}:</span>
                            <span className="font-bold text-lg text-primary">{formatPrice(order.amount, currency)}</span>
                        </div>
                        <div className="flex sm:justify-end justify-between items-center gap-3 text-xs text-text-tertiary">
                            <span>{t("seller.payment_method")}:</span>
                            <span className="font-medium text-text-secondary">{order.paymentType || t("payment.cod")}</span>
                        </div>
                        <div className="flex sm:justify-end justify-between items-center gap-3 text-xs text-text-tertiary">
                            <span>{t("seller.payment_status")}:</span>
                            <span className={order.isPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                                {order.isPaid ? t("seller.paid") : t("seller.pending")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl">
            {/* Header */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-text-primary">{t("seller.order_history")}</h2>
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
                                className={`outline-none border border-border rounded-[14px] ${isRTL ? "pr-8 pl-8" : "pl-8 pr-8"} py-2 text-xs bg-bg-white focus:border-primary focus:ring-1 focus:ring-primary w-full text-text-primary font-medium shadow-2xs transition`}
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
                            className="outline-none border border-border rounded-[14px] px-3 py-2 text-xs bg-bg-white focus:border-primary focus:ring-1 focus:ring-primary text-text-primary font-semibold cursor-pointer shadow-2xs transition"
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-green-50/80 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-[16px] p-4 text-center">
                        <p className="text-2xl font-bold font-heading text-green-700 dark:text-green-400">
                            {orders.filter(o => o.status === "Delivered").length}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-0.5">{t("status.delivered")}</p>
                    </div>
                    <div className="bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-[16px] p-4 text-center">
                        <p className="text-2xl font-bold font-heading text-red-600 dark:text-red-400">
                            {orders.filter(o => o.status === "Cancelled").length}
                        </p>
                        <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-0.5">{t("status.cancelled")}</p>
                    </div>
                    <div className="bg-surface-muted border border-border rounded-[16px] p-4 text-center">
                        <p className="text-2xl font-bold font-heading text-text-primary">
                            {formatPrice(orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.amount, 0), currency)}
                        </p>
                        <p className="text-xs text-text-secondary font-medium mt-0.5">{t("seller.total_sales")}</p>
                    </div>
                </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-text-tertiary font-medium">
                        ...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-text-tertiary font-medium border border-dashed border-border rounded-[16px] flex flex-col items-center gap-3">
                        <ShoppingBag className="w-10 h-10 text-text-placeholder" strokeWidth={1.5} />
                        <p>{t("orders.no_orders")}</p>
                    </div>
                ) : sortedOrders.length === 0 ? (
                    <div className="text-center py-10 text-text-tertiary font-medium border border-dashed border-border rounded-[16px]">
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

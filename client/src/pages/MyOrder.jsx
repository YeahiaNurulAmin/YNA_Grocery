/**
 * MyOrder — customer order history list.
 * Route: /my-orders. Fetches from /api/order/user.
 */
import React, { useEffect } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { Card, Badge, SectionHeader, EmptyState, Button } from "../components/ui";

import { socket } from "../configs/socket";

const statusVariant = (status) => {
  if (status === "Delivered") return "success";
  if (status === "Cancelled") return "error";
  if (status === "Out for delivery" || status === "Shipped") return "info";
  return "accent";
};

const MyOrder = () => {
  const [myOrders, setMyOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { currency, axios, user, navigate, setShowUserLogin } = useAppContext();
  const { t, formatPrice } = useLanguage();

  const translateStatus = (status) => {
    if (!status) return status;
    const lower = status.toLowerCase();
    if (lower.includes("deliver")) return t("status.delivered");
    if (lower.includes("cancel")) return t("status.cancelled");
    if (lower.includes("out")) return t("status.out_for_delivery");
    if (lower.includes("process")) return t("status.processing");
    return t("status.pending");
  };

  const fetchMyOrders = React.useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const { data } = await axios.get("/api/order/user");
      if (data.success) setMyOrders(data.orders);
      else console.error("Error fetching orders:", data.message);
    } catch (error) {
      console.error("Error fetching my orders:", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchMyOrders(false);

    const handleRealtimeUpdate = () => {
      fetchMyOrders(true);
    };

    socket.on("orders_updated", handleRealtimeUpdate);
    socket.on("new_order", handleRealtimeUpdate);

    const interval = setInterval(() => {
      fetchMyOrders(true);
    }, 5000);

    return () => {
      socket.off("orders_updated", handleRealtimeUpdate);
      socket.off("new_order", handleRealtimeUpdate);
      clearInterval(interval);
    };
  }, [user, fetchMyOrders]);

  if (!user) {
    return (
      <div className="py-16 mb-nav">
        <EmptyState
          icon={ShoppingBag}
          title={t("myorder.sign_in")}
          description={t("myorder.sign_in_desc")}
          action={<Button onClick={() => setShowUserLogin(true)}>{t("myorder.login")}</Button>}
        />
      </div>
    );
  }

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-4xl mx-auto">
      <SectionHeader
        eyebrow={t("myorder.eyebrow")}
        title={t("myorder.title")}
        subtitle={t("myorder.subtitle")}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-40 rounded-[24px]" />
          ))}
        </div>
      ) : myOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t("myorder.no_orders")}
          description={t("myorder.no_orders_desc")}
          action={<Button onClick={() => navigate("/products")}>{t("myorder.start_shopping")}</Button>}
        />
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <Card key={order._id} className="p-5! md:p-6!">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
                <div>
                  <p className="text-xs text-text-tertiary">{t("myorder.order_id")}</p>
                  <p className="font-mono text-sm text-text-primary mt-0.5 truncate max-w-[220px]">
                    {order._id}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{order.paymentType === "COD" ? t("payment.cod") : t("payment.stripe")}</Badge>
                  <Badge variant={statusVariant(order.status)}>{translateStatus(order.status)}</Badge>
                  <span className="font-heading font-bold text-primary">
                    {formatPrice(order.amount, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      itemIdx > 0 ? "pt-4 border-t border-border" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-[14px] bg-bg-light-mint flex items-center justify-center shrink-0">
                        <img
                          src={item.product?.images?.[0]}
                          alt={item.product?.name}
                          className="max-w-[80%] max-h-[80%] object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading font-semibold text-text-primary truncate">
                          {item.product?.name}
                        </h3>
                        <p className="text-xs text-text-tertiary mt-0.5">
                          {item.product?.category} · {t("myorder.qty")} {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-text-secondary md:text-right space-y-0.5">
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="font-semibold text-text-primary">
                        {formatPrice(item.quantity * (item.product?.offerPrice || item.product?.price || 0), currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;

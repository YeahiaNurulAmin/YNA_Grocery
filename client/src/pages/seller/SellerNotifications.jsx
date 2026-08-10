/**
 * SellerNotifications — full notifications page for new order events.
 * Route: /seller/notifications. Polls same /api/order/seller as the shell.
 */
import { useEffect, useState, useCallback } from "react";
import { Bell, ShoppingBag } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import { Card, SectionHeader, EmptyState, Button } from "../../components/ui";

const SellerNotifications = () => {
  const { axios, currency } = useAppContext();
  const { t, formatPrice } = useLanguage();
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (!data.success) return;
      const placed = (data.orders || [])
        .filter((o) => o.status === "Order Placed")
        .slice(0, 20)
        .map((o) => ({
          id: o._id,
          name: `${o.address?.firstName || "Customer"} ${o.address?.lastName || ""}`.trim(),
          amount: o.amount,
          time: new Date(o.createdAt).toLocaleString(),
        }));
      setItems(placed);
    } catch (e) {
      console.error(e);
    }
  }, [axios]);

  useEffect(() => {
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="animate-fade-in max-w-2xl">
      <SectionHeader
        eyebrow={t("seller.account_section")}
        title={t("seller.notifications")}
        subtitle={t("seller.notifications_subtitle") || "New Order Placed events from live polling."}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => load()}
          >
            {t("cart.try_again") || "Refresh"}
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={t("seller.no_notifs")}
          description={t("seller.no_stock_alerts")}
        />
      ) : (
        <Card className="p-0! overflow-hidden divide-y divide-border">
          {items.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t("seller.new_order_title")} — {n.name}</p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {formatPrice(n.amount, currency)} · {n.time}
                </p>
                <p className="text-[11px] font-mono text-text-placeholder mt-1 truncate">{n.id}</p>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default SellerNotifications;

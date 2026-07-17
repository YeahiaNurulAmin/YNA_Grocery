/**
 * SellerNotifications — full notifications page for new order events.
 * Route: /seller/notifications. Polls same /api/order/seller as the shell.
 */
import { useEffect, useState, useCallback } from "react";
import { Bell, ShoppingBag } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Card, SectionHeader, EmptyState, Button } from "../../components/ui";

const SEEN_KEY = "yna_admin_seen_orders";

const SellerNotifications = () => {
  const { axios, currency } = useAppContext();
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
        eyebrow="Inbox"
        title="Notifications"
        subtitle="New Order Placed events from live polling."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.setItem(SEEN_KEY, "[]");
              load();
            }}
          >
            Refresh
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up"
          description="New placed orders will appear here automatically."
        />
      ) : (
        <Card className="!p-0 overflow-hidden divide-y divide-border">
          {items.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">New order — {n.name}</p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {currency}{n.amount} · {n.time}
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

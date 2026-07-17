/**
 * SellerDashboard — overview with stats, recent orders, stock alerts, quick actions.
 * Route: /seller/dashboard. Aggregates existing order/product APIs only.
 * Respects lowStock preference from localStorage (yna_seller_prefs).
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Ticket,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Card, Badge, Button, SectionHeader, Skeleton, EmptyState } from "../../components/ui";
import toast from "react-hot-toast";

const PREFS_KEY = "yna_seller_prefs";

const SellerDashboard = () => {
  const { axios, currency, products, fetchProducts } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [showLowStock, setShowLowStock] = useState(true);

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
      setShowLowStock(prefs.lowStock !== false);
    } catch {
      setShowLowStock(true);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setOrdersError(null);
      try {
        await fetchProducts?.();
        const { data } = await axios.get("/api/order/seller");
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setOrdersError(data.message || "Failed to load orders");
          toast.error(data.message || "Failed to load orders");
        }
      } catch (e) {
        console.error(e);
        setOrdersError("Failed to load orders");
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const delivered = orders.filter((o) => o.status === "Delivered");
  const active = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
  const revenue = delivered.reduce((sum, o) => sum + (o.amount || 0), 0);
  const lowStock = showLowStock
    ? (products || []).filter((p) => p.inStock && (p.quantity ?? 99) <= 5)
    : [];
  const outOfStock = showLowStock ? (products || []).filter((p) => !p.inStock) : [];
  const recent = [...orders].slice(0, 5);

  const stats = [
    { label: "Revenue", value: `${currency || "$"}${revenue.toFixed(0)}`, icon: DollarSign, hint: "Delivered orders" },
    { label: "Active orders", value: active.length, icon: ShoppingBag, hint: "In progress" },
    { label: "Products", value: products?.length || 0, icon: Package, hint: "In catalog" },
    { label: "Low stock", value: lowStock.length, icon: AlertTriangle, hint: "Needs attention" },
  ];

  return (
    <div className="animate-fade-in max-w-6xl">
      <SectionHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="A clear snapshot of your store performance."
        action={
          <Button asChild size="sm">
            <Link to="/seller">
              <PlusCircle className="w-4 h-4" /> Add product
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-[24px]" />
            ))
          : stats.map((s) => (
              <Card key={s.label} className="p-5!" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-text-tertiary">{s.label}</p>
                    <p className="font-heading text-2xl font-bold text-text-primary mt-1">{s.value}</p>
                    <p className="text-[11px] text-text-tertiary mt-1">{s.hint}</p>
                  </div>
                  <div className="w-10 h-10 rounded-[14px] bg-bg-light-mint text-primary flex items-center justify-center">
                    <s.icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                </div>
              </Card>
            ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0! overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-heading font-semibold">Recent orders</h3>
            <Link to="/seller/orders" className="text-xs font-semibold text-primary flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {!loading && ordersError ? (
              <div className="p-6">
                <EmptyState
                  icon={ShoppingBag}
                  title="Couldn’t load orders"
                  description={ordersError}
                />
              </div>
            ) : recent.length === 0 ? (
              <p className="p-8 text-sm text-text-tertiary text-center">No orders yet</p>
            ) : (
              recent.map((o) => (
                <div key={o._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {o.address?.firstName} {o.address?.lastName}
                    </p>
                    <p className="text-xs text-text-tertiary truncate">{o._id}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{currency}{o.amount}</p>
                    <Badge variant="outline" className="mt-1">{o.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5!">
            <h3 className="font-heading font-semibold mb-3">Quick actions</h3>
            <div className="space-y-2">
              {[
                { to: "/seller", label: "Add product", icon: PlusCircle },
                { to: "/seller/orders", label: "Manage orders", icon: ShoppingBag },
                { to: "/seller/coupons", label: "Coupons", icon: Ticket },
              ].map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="flex items-center gap-3 p-3 rounded-[14px] hover:bg-bg-light-mint text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  <a.icon className="w-4 h-4" />
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5!">
            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Stock alerts
            </h3>
            {!showLowStock ? (
              <p className="text-sm text-text-tertiary">Stock alerts are turned off in Settings</p>
            ) : outOfStock.length === 0 && lowStock.length === 0 ? (
              <p className="text-sm text-text-tertiary">All good — no alerts</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {outOfStock.slice(0, 3).map((p) => (
                  <li key={p._id} className="flex justify-between gap-2">
                    <span className="truncate">{p.name}</span>
                    <Badge variant="error">Out</Badge>
                  </li>
                ))}
                {lowStock.slice(0, 3).map((p) => (
                  <li key={p._id} className="flex justify-between gap-2">
                    <span className="truncate">{p.name}</span>
                    <Badge variant="warning">Low</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

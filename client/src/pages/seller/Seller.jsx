/**
 * Seller shell — sidebar navigation, top bar, dark mode, and order notification polling.
 * Used as the layout wrapper for all /seller/* routes via React Router Outlet in App.jsx.
 * Reads seller prefs from localStorage (yna_seller_prefs) for notification chime.
 */
import { Link, NavLink, Outlet } from "react-router-dom";
import { YNALogo } from "../../assets/YNALogo.jsx";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    LayoutDashboard,
    PlusCircle,
    Package,
    ShoppingBag,
    History,
    Ticket,
    Bell,
    Settings,
    User,
    Sun,
    Moon,
    LogOut,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "../../components/ui";

const PREFS_KEY = "yna_seller_prefs";
const DEFAULT_PREFS = { chime: true, emailDigest: false, lowStock: true };

const getSellerPrefs = () => {
    try {
        return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") };
    } catch {
        return { ...DEFAULT_PREFS };
    }
};

const playNotificationChime = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [880, 1108, 1318];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.65);
        });
    } catch (_) { /* audio not supported */ }
};

const SEEN_KEY = "yna_admin_seen_orders";
const getSeenIds = () => {
    try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); }
    catch { return new Set(); }
};
const addSeenIds = (ids) => {
    const current = getSeenIds();
    ids.forEach(id => current.add(id));
    localStorage.setItem(SEEN_KEY, JSON.stringify([...current]));
};

const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-200 ${
        isActive
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
    }`;

const Seller = () => {
    const { navigate, axios, currency } = useAppContext();
    const [moreOpen, setMoreOpen] = useState(false);

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("yna_theme") === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("yna_theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("yna_theme", "light");
        }
    }, [isDark]);

    const [notifications, setNotifications] = useState([]);
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const notifPanelRef = useRef(null);
    const morePanelRef = useRef(null);
    const pollingRef = useRef(null);

    const checkForNewOrders = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/order/seller");
            if (!data.success) return;
            const orders = data.orders;
            const seenIds = getSeenIds();
            const newOrders = orders.filter(o => !seenIds.has(o._id) && o.status === "Order Placed");
            if (newOrders.length > 0) {
                if (getSellerPrefs().chime) playNotificationChime();
                const newNotifs = newOrders.map(o => ({
                    id: o._id,
                    name: `${o.address?.firstName || "Customer"} ${o.address?.lastName || ""}`.trim(),
                    amount: o.amount,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }));
                setNotifications(prev => [...newNotifs, ...prev].slice(0, 20));
                addSeenIds(newOrders.map(o => o._id));
                newOrders.forEach(o => {
                    toast.custom((t) => (
                        <div className={`flex items-start gap-3 bg-bg-white border border-primary/20 rounded-[16px] shadow-lg px-4 py-3 max-w-sm ${t.visible ? "animate-enter" : "animate-leave"}`}>
                            <div className="w-9 h-9 rounded-[12px] bg-primary/10 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-4 h-4 text-primary" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="font-heading font-bold text-text-primary text-sm">New Order!</p>
                                <p className="text-xs text-text-secondary">
                                    {`${o.address?.firstName || ""} ${o.address?.lastName || ""}`.trim()} — {currency}{o.amount}
                                </p>
                            </div>
                        </div>
                    ), { duration: 5000 });
                });
            }
        } catch (_) { /* silent fail on polling */ }
    }, [axios, currency]);

    useEffect(() => {
        axios.get("/api/order/seller").then(({ data }) => {
            if (data.success) addSeenIds(data.orders.map(o => o._id));
        }).catch(() => { });

        pollingRef.current = setInterval(checkForNewOrders, 15000);
        return () => clearInterval(pollingRef.current);
    }, [checkForNewOrders, axios]);

    useEffect(() => {
        const handler = (e) => {
            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
                setShowNotifPanel(false);
            }
            if (morePanelRef.current && !morePanelRef.current.contains(e.target)) {
                setMoreOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const unreadCount = notifications.length;

    const mainLinks = [
        { name: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard, end: false },
        { name: "Add Product", path: "/seller", icon: PlusCircle, end: true },
        { name: "Products", path: "/seller/products", icon: Package, end: false },
        { name: "Orders", path: "/seller/orders", icon: ShoppingBag, end: false },
        { name: "History", path: "/seller/history", icon: History, end: false },
        { name: "Coupons", path: "/seller/coupons", icon: Ticket, end: false },
    ];

    const accountLinks = [
        { name: "Notifications", path: "/seller/notifications", icon: Bell },
        { name: "Settings", path: "/seller/settings", icon: Settings },
        { name: "Profile", path: "/seller/profile", icon: User },
    ];

    const moreLinks = [
        { name: "Coupons", path: "/seller/coupons", icon: Ticket },
        ...accountLinks,
    ];

    const logoutHandler = async () => {
        try {
            const { data } = await axios.get('/api/seller/logout');
            if (data.success) {
                toast.success(data.message);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error logging out");
            console.error("Error in logoutHandler:", error);
        }
    };

    return (
        <div className="min-h-screen bg-bg-cream text-text-primary transition-colors duration-300">
            {/* Top bar */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 border-b border-border/60 py-3 bg-bg-white/80 backdrop-blur-xl">
                <Link to="/" className="shrink-0">
                    <YNALogo size="small" />
                </Link>

                <div className="flex items-center gap-2 md:gap-4">
                    <span className="text-sm hidden md:inline text-text-secondary font-medium">Hi! Admin</span>

                    <button
                        id="dark-mode-toggle"
                        onClick={() => setIsDark(d => !d)}
                        className="relative w-11 h-6 rounded-full border border-border bg-surface-muted hover:border-primary/40 transition-colors flex items-center cursor-pointer"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        <span className={`absolute flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-300 ${isDark ? "translate-x-[22px] bg-surface-elevated text-accent" : "translate-x-0.5 bg-primary text-white"}`}>
                            {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                        </span>
                    </button>

                    <div className="relative" ref={notifPanelRef}>
                        <button
                            id="notification-bell"
                            onClick={() => { setShowNotifPanel(p => !p); }}
                            className="relative p-2 rounded-[12px] hover:bg-surface-muted transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5" strokeWidth={1.75} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifPanel && (
                            <div className="absolute right-0 top-12 w-80 bg-bg-white border border-border/60 rounded-[20px] shadow-xl z-50 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-surface-muted/50">
                                    <p className="font-heading font-bold text-sm">Notifications</p>
                                    <div className="flex items-center gap-2">
                                        {notifications.length > 0 && (
                                            <button onClick={() => setNotifications([])} className="text-xs text-text-tertiary hover:text-error transition-colors cursor-pointer">
                                                Clear all
                                            </button>
                                        )}
                                        <Link to="/seller/notifications" onClick={() => setShowNotifPanel(false)} className="text-xs text-primary hover:underline font-medium">
                                            View all
                                        </Link>
                                    </div>
                                </div>
                                <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
                                    {notifications.length === 0 ? (
                                        <div className="py-10 text-center text-text-tertiary text-sm">
                                            <Bell className="w-8 h-8 mx-auto mb-2 text-text-placeholder" strokeWidth={1.5} />
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map((n, i) => (
                                            <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-muted/50 transition-colors">
                                                <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <ShoppingBag className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">New Order — {n.name}</p>
                                                    <p className="text-xs text-text-tertiary">Amount: {currency}{n.amount} · {n.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button variant="outline" size="sm" onClick={logoutHandler} className="hidden sm:inline-flex">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                    <button onClick={logoutHandler} className="sm:hidden p-2 rounded-[12px] hover:bg-surface-muted text-text-secondary" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden md:flex w-60 shrink-0 border-r border-border/60 min-h-[calc(100vh-57px)] flex-col bg-bg-white">
                    <nav className="flex-1 p-4 space-y-1">
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-tertiary">Store</p>
                        {mainLinks.map((item) => (
                            <NavLink to={item.path} key={item.path} end={item.end} className={navLinkClass}>
                                <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                                <span className="flex-1">{item.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-border/60 space-y-1">
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-tertiary">Account</p>
                        {accountLinks.map((item) => (
                            <NavLink to={item.path} key={item.path} className={navLinkClass}>
                                <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </aside>

                {/* Mobile bottom nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 bg-bg-white/90 backdrop-blur-xl border-t border-border/60 pb-safe">
                    {mainLinks.slice(0, 4).map((item) => (
                        <NavLink to={item.path} key={item.path} end={item.end}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-0.5 p-2 rounded-[12px] text-[10px] font-medium transition-colors ${
                                    isActive ? "text-primary" : "text-text-tertiary"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" strokeWidth={1.75} />
                            <span>{item.name.split(" ")[0]}</span>
                        </NavLink>
                    ))}
                    <div className="relative" ref={morePanelRef}>
                        <button
                            type="button"
                            onClick={() => setMoreOpen((v) => !v)}
                            className={`flex flex-col items-center gap-0.5 p-2 rounded-[12px] text-[10px] font-medium transition-colors cursor-pointer ${
                                moreOpen ? "text-primary" : "text-text-tertiary"
                            }`}
                            aria-expanded={moreOpen}
                            aria-haspopup="menu"
                        >
                            <MoreHorizontal className="w-5 h-5" strokeWidth={1.75} />
                            <span>More</span>
                        </button>
                        {moreOpen && (
                            <div
                                role="menu"
                                className="absolute bottom-full right-0 mb-2 w-48 bg-bg-white border border-border/60 rounded-[16px] shadow-xl overflow-hidden"
                            >
                                {moreLinks.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        role="menuitem"
                                        onClick={() => setMoreOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:bg-surface-muted hover:text-primary"
                                    >
                                        <item.icon className="w-4 h-4" strokeWidth={1.75} />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Main content */}
                <main className="flex-1 min-h-[calc(100vh-57px)] overflow-y-auto no-scrollbar mb-nav md:mb-0">
                    <div className="p-4 md:p-8 lg:p-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Seller;

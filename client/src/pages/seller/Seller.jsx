import { Link, NavLink, Outlet } from "react-router-dom";
import { YNALogo } from "../../assets/YNALogo.jsx";
import { assets } from "../../assets/assets.js";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import React, { useState, useEffect, useRef, useCallback } from "react";

// ── Web Audio helper: synthesise a soft chime without any external file ───────
const playNotificationChime = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [880, 1108, 1318];          // A5 – C#6 – E6  (major chord)
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

// ── Seen-orders localStorage helper ──────────────────────────────────────────
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

const Seller = () => {

    const { navigate, axios } = useAppContext();

    // ── Dark Mode ───────────────────────────────────────────────────────────
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

    // ── Notifications ───────────────────────────────────────────────────────
    const [notifications, setNotifications] = useState([]);
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const notifPanelRef = useRef(null);
    const pollingRef = useRef(null);

    const checkForNewOrders = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/order/seller");
            if (!data.success) return;
            const orders = data.orders;
            const seenIds = getSeenIds();
            const newOrders = orders.filter(o => !seenIds.has(o._id) && o.status === "Order Placed");
            if (newOrders.length > 0) {
                playNotificationChime();
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
                        <div className={`flex items-start gap-3 bg-white dark:bg-slate-800 border border-green-200 rounded-xl shadow-xl px-4 py-3 max-w-sm ${t.visible ? "animate-enter" : "animate-leave"}`}>
                            <span className="text-2xl">🛍️</span>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">New Order!</p>
                                <p className="text-xs text-gray-600">
                                    {`${o.address?.firstName || ""} ${o.address?.lastName || ""}`.trim()} — ${o.amount}
                                </p>
                            </div>
                        </div>
                    ), { duration: 5000 });
                });
            }
        } catch (_) { /* silent fail on polling */ }
    }, [axios]);

    // Initialise seen IDs on first mount and start polling
    useEffect(() => {
        // Seed existing orders as "seen" on first load so we only notify about NEW ones
        axios.get("/api/order/seller").then(({ data }) => {
            if (data.success) addSeenIds(data.orders.map(o => o._id));
        }).catch(() => {});

        pollingRef.current = setInterval(checkForNewOrders, 15000);
        return () => clearInterval(pollingRef.current);
    }, [checkForNewOrders, axios]);

    // Close notification panel when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
                setShowNotifPanel(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const unreadCount = notifications.length;

    // ── Sidebar links ───────────────────────────────────────────────────────
    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: <img src={assets.add_icon} alt="add_icon" className="w-6 h-6 dark:invert" /> },
        { name: "Products", path: "/seller/products", icon: <img src={assets.product_list_icon} alt="product_list_icon" className="w-6 h-6 dark:invert" /> },
        { name: "Orders", path: "/seller/orders", icon: <img src={assets.order_icon} alt="order_icon" className="w-6 h-6 dark:invert" /> },
        {
            name: "History",
            path: "/seller/history",
            icon: (
                <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )
        },
        {
            name: "Coupons",
            path: "/seller/coupons",
            icon: (
                <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l1.5-1.5m3-3l1.5-1.5M9.75 9.75h.008v.008H9.75V9.75zm4.5 4.5h.008v.008h-.008v-.008zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
                </svg>
            )
        },
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-all duration-300">
            {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 dark:border-slate-800 py-3 bg-white dark:bg-slate-900 transition-all duration-300">
                <Link to="/">
                    <YNALogo size="small"></YNALogo>
                </Link>

                <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
                    <span className="text-sm hidden md:inline text-gray-600 dark:text-slate-300">Hi! Admin</span>

                    {/* ── Dark Mode Toggle ───────────────────────────────────── */}
                    <button
                        id="dark-mode-toggle"
                        onClick={() => setIsDark(d => !d)}
                        className="relative w-10 h-5 rounded-full border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 hover:border-primary transition-colors flex items-center cursor-pointer overflow-hidden"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        <span className={`absolute left-0.5 w-4 h-4 rounded-full transition-transform duration-300 flex items-center justify-center text-[9px] ${isDark ? "translate-x-5 bg-slate-700" : "translate-x-0 bg-yellow-400"}`}>
                            {isDark ? "🌙" : "☀️"}
                        </span>
                    </button>

                    {/* ── Notification Bell ──────────────────────────────────── */}
                    <div className="relative" ref={notifPanelRef}>
                        <button
                            id="notification-bell"
                            onClick={() => { setShowNotifPanel(p => !p); }}
                            className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-gray-600 dark:text-slate-300"
                            title="Notifications"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifPanel && (
                            <div className="absolute right-0 top-10 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-gray-900 dark:text-slate-100">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                                    <p className="font-bold text-sm">Notifications</p>
                                    {notifications.length > 0 && (
                                        <button onClick={() => setNotifications([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-gray-400 dark:text-slate-500 text-sm">
                                            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                            </svg>
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map((n, i) => (
                                            <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <span className="text-xl mt-0.5">🛍️</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">New Order — {n.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-slate-400">Amount: ${n.amount} · {n.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="cursor-pointer hover:bg-primary-light dark:hover:bg-primary/20 border border-primary rounded-full text-sm px-4 py-1 text-accent dark:text-accent-light" onClick={logoutHandler}>Logout</button>
                </div>
            </div>

            {/* ── Sidebar + Content ───────────────────────────────────────────── */}
            <div className="flex bg-slate-50 dark:bg-slate-950">
                <div className="md:w-44 w-16 border-r h-[95vh] text-base border-gray-300 dark:border-slate-800 pt-4 flex flex-col transition-all duration-300 bg-white dark:bg-slate-900">
                    {sidebarLinks.map((item, index) => (
                        <NavLink to={item.path} key={index} end={item.path === "/seller"}
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3 transition-colors 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 dark:hover:bg-slate-800 border-white dark:border-transparent text-gray-700 dark:text-slate-300"
                                }`
                            }
                        >
                            {item.icon}
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <div className="flex-1 h-[95vh] overflow-y-auto">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default Seller;
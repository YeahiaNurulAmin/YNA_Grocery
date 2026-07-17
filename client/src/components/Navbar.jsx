/**
 * Navbar — premium sticky storefront navigation with search, cart, auth.
 * Used on all non-seller customer routes.
 */
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { YNALogo } from "../assets/YNALogo";
import { useAppContext } from "../context/AppContext";
import { Button } from "./ui";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("yna_theme") === "dark");
  const menuRef = useRef(null);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    cartItems,
    searchQuery,
    setSearchQuery,
    axios,
  } = useAppContext();

  const cartCount = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in logoutHandler:", error);
    }
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.add("theme-transition");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("yna_theme", next ? "dark" : "light");
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 250);
  };

  useEffect(() => {
    if (localStorage.getItem("yna_theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (searchQuery) navigate("/search");
  }, [searchQuery]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-primary" : "text-text-secondary hover:text-primary"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-bg-white/80 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 px-5 md:px-8 lg:px-12 py-3.5">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <YNALogo size="small" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-end">
          <div className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>

          <div className="hidden lg:flex items-center gap-2 h-11 w-64 xl:w-80 px-3.5 rounded-[16px] bg-surface-muted border border-transparent focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <Search className="w-4 h-4 text-text-tertiary shrink-0" strokeWidth={1.75} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-text-primary placeholder:text-text-placeholder"
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-[14px] flex items-center justify-center text-text-tertiary hover:text-primary hover:bg-bg-light-mint transition-colors cursor-pointer"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative h-10 w-10 rounded-[14px] flex items-center justify-center text-text-secondary hover:text-primary hover:bg-bg-light-mint transition-colors cursor-pointer"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {!user ? (
            <Button size="md" onClick={() => setShowUserLogin(true)}>
              Login
            </Button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-[16px] border border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-bg-white border border-border rounded-[20px] shadow-lg p-2 z-50 animate-scale-in">
                  <button
                    type="button"
                    onClick={() => { navigate("/my-orders"); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-[14px] text-sm text-text-secondary hover:bg-bg-light-mint hover:text-primary cursor-pointer"
                  >
                    My Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => { navigate("/wishlist"); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-[14px] text-sm text-text-secondary hover:bg-bg-light-mint hover:text-primary cursor-pointer"
                  >
                    Wishlist
                  </button>
                  <button
                    type="button"
                    onClick={() => { logoutHandler(); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-[14px] text-sm text-error hover:bg-error/10 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile top actions */}
        <div className="flex md:hidden items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-[14px] flex items-center justify-center text-text-tertiary cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="h-10 w-10 rounded-[14px] flex items-center justify-center text-text-primary cursor-pointer"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg-white px-5 py-5 space-y-1 animate-slide-up">
          <div className="flex items-center gap-2 h-11 px-3.5 rounded-[16px] bg-surface-muted mb-4">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Search products…"
              onKeyDown={(e) => {
                if (e.key === "Enter") { setOpen(false); navigate("/search"); }
              }}
            />
          </div>
          {[
            { to: "/", label: "Home" },
            { to: "/products", label: "All Products" },
            { to: "/contact", label: "Contact" },
            { to: "/faq", label: "FAQ" },
            ...(user ? [{ to: "/my-orders", label: "My Orders" }] : []),
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-[14px] text-sm font-medium text-text-secondary hover:bg-bg-light-mint hover:text-primary"
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-3">
            {!user ? (
              <Button className="w-full" onClick={() => { setOpen(false); setShowUserLogin(true); }}>
                Login
              </Button>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => { setOpen(false); logoutHandler(); }}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

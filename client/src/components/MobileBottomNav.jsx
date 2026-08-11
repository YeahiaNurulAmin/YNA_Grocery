/**
 * MobileBottomNav — touch-friendly bottom navigation for key customer routes.
 * Shown on sm and below; paired with .mb-nav padding on page content.
 * Translatable via useLanguage hook.
 */
import { NavLink, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartItems, user, setShowUserLogin, navigate } = useAppContext();
  const { t } = useLanguage();

  const cartCount = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0 transition-colors duration-200 ${
      isActive ? "text-primary" : "text-text-tertiary"
    }`;

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-bg-white/95 backdrop-blur-xl border-t border-border pb-safe shadow-[0_-4px_24px_rgb(15_23_42/0.06)]"
      aria-label={t("nav.mobile_nav")}
    >
      <div className="flex items-stretch h-16 px-1">
        <NavLink to="/" end className={linkClass}>
          <Home className="w-5 h-5" strokeWidth={1.75} />
          <span className="text-[10px] font-medium">{t("nav.home")}</span>
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          <LayoutGrid className="w-5 h-5" strokeWidth={1.75} />
          <span className="text-[10px] font-medium">{t("nav.shop")}</span>
        </NavLink>
        <NavLink to="/search" className={linkClass}>
          <Search className="w-5 h-5" strokeWidth={1.75} />
          <span className="text-[10px] font-medium">{t("nav.search_placeholder").split(" ")[0]}</span>
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          <span className="relative">
            <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </span>
          <span className="text-[10px] font-medium">{t("nav.cart")}</span>
        </NavLink>
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0 transition-colors duration-200 cursor-pointer ${
            location.pathname === "/profile" ? "text-primary" : "text-text-tertiary"
          }`}
          onClick={() => {
            if (user) navigate("/profile");
            else setShowUserLogin(true);
          }}
        >
          <User className="w-5 h-5" strokeWidth={1.75} />
          <span className="text-[10px] font-medium">{t("nav.account")}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;

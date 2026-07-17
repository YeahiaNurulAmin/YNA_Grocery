/**
 * LoadingPage — post-Stripe payment redirect splash before navigating to next URL.
 * Route: /loader?next=...
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { YNALogo } from "../../assets/YNALogo";

const LoadingPage = () => {
  const { navigate } = useAppContext();
  const { search } = useLocation();
  const nextUrl = new URLSearchParams(search).get("next") || "/";

  useEffect(() => {
    const t = setTimeout(() => navigate(`/${nextUrl}`), 5000);
    return () => clearTimeout(t);
  }, [nextUrl, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gradient-hero bg-bg-cream">
      <YNALogo size="medium" />
      <div className="mt-10 flex items-center gap-3" aria-label="Loading">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-text-secondary font-medium">
        Confirming your payment…
      </p>
    </div>
  );
};

export default LoadingPage;

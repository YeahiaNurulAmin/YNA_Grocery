/**
 * YNALogo — Official YNA Grocery mark: green squircle + white paper bag + orange leaf.
 * Used in Navbar, Footer, Seller shell, Login, LoadingPage, and favicon contexts.
 * Replaces the old shopping-cart mark with the approved shopping-bag identity.
 */
import logoMarkPng from "./yna_logo_mark.png";

const sizes = {
  icon: { mark: 40, height: 40 },
  small: { mark: 36, height: 40 },
  medium: { mark: 44, height: 48 },
  large: { mark: 56, height: 64 },
};

export const YNALogo = ({ size = "medium", variant = "full", className = "" }) => {
  const dims = sizes[size] || sizes.medium;
  const isIcon = variant === "icon" || size === "icon";

  if (isIcon) {
    return (
      <img
        src={logoMarkPng}
        width={dims.mark}
        height={dims.mark}
        alt="YNA Grocery"
        className={className}
        style={{ borderRadius: Math.round(dims.mark * 0.29), display: "block" }}
      />
    );
  }

  const textSize =
    size === "large" ? "text-[1.65rem]" : size === "medium" ? "text-[1.4rem]" : "text-[1.15rem]";
  const subSize =
    size === "large" ? "text-[11px]" : size === "medium" ? "text-[10px]" : "text-[9px]";

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ height: dims.height }}
      aria-label="YNA Grocery"
      role="img"
    >
      <img
        src={logoMarkPng}
        width={dims.mark}
        height={dims.mark}
        alt=""
        aria-hidden="true"
        style={{ borderRadius: Math.round(dims.mark * 0.29), display: "block", flexShrink: 0 }}
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-heading font-extrabold text-primary tracking-tight ${textSize}`}
          style={{ letterSpacing: "-0.03em" }}
        >
          YNA
        </span>
        <span
          className={`font-semibold text-accent ${subSize}`}
          style={{ letterSpacing: "0.18em", marginTop: 3 }}
        >
          GROCERY
        </span>
      </span>
    </span>
  );
};

export default YNALogo;

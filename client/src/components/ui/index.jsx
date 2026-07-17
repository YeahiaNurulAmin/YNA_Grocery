/**
 * UI primitives — reusable Button, Input, Card, Badge, EmptyState, Skeleton.
 * Used across storefront and seller dashboard for consistent premium styling.
 */
import { Loader2 } from "lucide-react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* ── Button ─────────────────────────────────────────────── */
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled,
  type = "button",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold font-heading transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md hover:-translate-y-0.5",
    accent:
      "bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md hover:-translate-y-0.5",
    secondary:
      "bg-bg-light-mint text-primary hover:bg-primary/15 border border-primary/20",
    outline:
      "bg-transparent border border-border text-text-primary hover:border-primary hover:text-primary hover:bg-bg-light-mint/50",
    ghost:
      "bg-transparent text-text-secondary hover:text-primary hover:bg-bg-light-mint/60",
    danger:
      "bg-error/10 text-error hover:bg-error/20 border border-error/20",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm rounded-[14px]",
    md: "h-11 px-5 text-sm rounded-[16px]",
    lg: "h-12 px-7 text-base rounded-[16px]",
    xl: "h-14 px-8 text-base rounded-[18px]",
    icon: "h-11 w-11 rounded-[16px]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

/* ── Input ──────────────────────────────────────────────── */
export const Input = ({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || props.name;
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cx(
          "w-full h-12 px-4 rounded-[16px] bg-bg-white border border-border text-text-primary placeholder:text-text-placeholder",
          "transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
          error && "border-error focus:border-error focus:ring-error/10",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-text-tertiary">{hint}</p>}
    </div>
  );
};

/* ── Textarea ───────────────────────────────────────────── */
export const Textarea = ({ label, className = "", id, ...props }) => {
  const inputId = id || props.name;
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cx(
          "w-full min-h-28 px-4 py-3 rounded-[16px] bg-bg-white border border-border text-text-primary placeholder:text-text-placeholder",
          "transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y",
          className
        )}
        {...props}
      />
    </div>
  );
};

/* ── Card ───────────────────────────────────────────────── */
export const Card = ({ children, className = "", hover = false, padding = true, ...props }) => (
  <div
    className={cx(
      "bg-bg-white rounded-[24px] border border-border/60 shadow-sm",
      hover && "transition-all duration-250 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20",
      padding && "p-5 md:p-6",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

/* ── Badge ──────────────────────────────────────────────── */
export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-surface-muted text-text-secondary",
    success: "bg-primary/10 text-primary-dark",
    accent: "bg-accent/10 text-accent-dark",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info",
    outline: "bg-transparent border border-border text-text-tertiary",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

/* ── Empty State ────────────────────────────────────────── */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) => (
  <div className={cx("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
    {Icon && (
      <div className="w-16 h-16 rounded-[20px] bg-bg-light-mint flex items-center justify-center mb-5 text-primary">
        <Icon className="w-7 h-7" strokeWidth={1.75} />
      </div>
    )}
    <h3 className="font-heading text-xl font-bold text-text-primary">{title}</h3>
    {description && (
      <p className="mt-2 text-sm text-text-secondary max-w-sm leading-relaxed">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

/* ── Skeleton ───────────────────────────────────────────── */
export const Skeleton = ({ className = "" }) => (
  <div className={cx("skeleton", className)} aria-hidden="true" />
);

export const ProductCardSkeleton = () => (
  <div className="rounded-[24px] border border-border/60 bg-bg-white p-4 space-y-3">
    <Skeleton className="aspect-square w-full rounded-[18px]" />
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center pt-1">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-9 w-20 rounded-[14px]" />
    </div>
  </div>
);

/* ── Section Header ─────────────────────────────────────── */
export const SectionHeader = ({ eyebrow, title, subtitle, action, className = "" }) => (
  <div className={cx("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)}>
    <div>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-text-secondary text-sm md:text-base max-w-xl">{subtitle}</p>
      )}
    </div>
    {action}
  </div>
);

/* ── Page shell ─────────────────────────────────────────── */
export const Page = ({ children, className = "", narrow = false }) => (
  <div
    className={cx(
      "w-full mx-auto animate-fade-in",
      narrow ? "max-w-3xl" : "max-w-[1400px]",
      className
    )}
  >
    {children}
  </div>
);

export default Button;

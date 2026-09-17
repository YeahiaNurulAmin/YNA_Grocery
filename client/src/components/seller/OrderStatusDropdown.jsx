import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const STATUS_OPTIONS = [
  { id: "Order Placed", labelKey: "status.order_placed", dotColor: "bg-blue-500", dotAnimation: "" },
  { id: "Packing", labelKey: "status.packing", dotColor: "bg-purple-500", dotAnimation: "animate-pulse" },
  { id: "Shipped", labelKey: "status.shipped", dotColor: "bg-amber-500", dotAnimation: "" },
  { id: "Out for delivery", labelKey: "status.out_for_delivery", dotColor: "bg-teal-500", dotAnimation: "animate-ping" },
  { id: "Delivered", labelKey: "status.delivered", dotColor: "bg-green-500", dotAnimation: "" },
  { id: "Cancelled", labelKey: "status.cancelled", dotColor: "bg-red-500", dotAnimation: "" },
];

export const OrderStatusDropdown = ({ currentStatus, onStatusChange, disabled = false }) => {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = STATUS_OPTIONS.find((s) => s.id === currentStatus) || STATUS_OPTIONS[0];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (statusId) => {
    if (statusId !== currentStatus) {
      onStatusChange(statusId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full h-11 px-3.5 rounded-[16px] border bg-bg-white flex items-center justify-between gap-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs select-none ${
          isOpen
            ? "border-primary ring-4 ring-primary/10 shadow-sm"
            : "border-border hover:border-primary/40 hover:bg-surface-muted/30"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            {activeOption.dotAnimation && (
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${activeOption.dotColor} ${activeOption.dotAnimation}`}
              />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${activeOption.dotColor}`} />
          </span>
          <span className="truncate text-text-primary font-bold">
            {t(activeOption.labelKey)}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-text-tertiary transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 top-full mt-2 w-full bg-bg-white border border-border rounded-[18px] shadow-xl p-1.5 z-50 animate-fade-in ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {STATUS_OPTIONS.map((option) => {
            const isSelected = option.id === currentStatus;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-[12px] text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-bg-light-mint text-primary font-bold shadow-2xs"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                    {option.dotAnimation && (
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${option.dotColor} ${option.dotAnimation}`}
                      />
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${option.dotColor}`} />
                  </span>
                  <span className="truncate">{t(option.labelKey)}</span>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderStatusDropdown;

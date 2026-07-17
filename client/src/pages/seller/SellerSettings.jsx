/**
 * SellerSettings — UI-only admin settings (theme, notifications prefs).
 * Route: /seller/settings
 */
import { useState } from "react";
import { Card, SectionHeader, Button } from "../../components/ui";
import toast from "react-hot-toast";

const SellerSettings = () => {
  const [prefs, setPrefs] = useState({
    chime: true,
    emailDigest: false,
    lowStock: true,
  });

  return (
    <div className="animate-fade-in max-w-2xl">
      <SectionHeader eyebrow="Account" title="Settings" subtitle="Preferences for your admin experience." />
      <Card className="!p-6 space-y-5">
        {[
          { key: "chime", label: "Order chime", desc: "Play a soft sound for new Order Placed events" },
          { key: "emailDigest", label: "Daily digest", desc: "Email summary of orders (UI only)" },
          { key: "lowStock", label: "Stock alerts", desc: "Highlight low-stock products on the dashboard" },
        ].map((item) => (
          <label key={item.key} className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <p className="font-medium text-sm text-text-primary">{item.label}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={prefs[item.key]}
              onChange={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))}
              className="mt-1 accent-primary w-4 h-4"
            />
          </label>
        ))}
        <Button
          onClick={() => toast.success("Preferences saved locally")}
          className="mt-2"
        >
          Save preferences
        </Button>
      </Card>
    </div>
  );
};

export default SellerSettings;

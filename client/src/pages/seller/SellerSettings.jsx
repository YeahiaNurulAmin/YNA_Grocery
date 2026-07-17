/**
 * SellerSettings — admin preferences persisted in localStorage (yna_seller_prefs).
 * Controls chime (Seller shell), emailDigest (stored for future), lowStock (Dashboard).
 * Route: /seller/settings
 */
import { useState } from "react";
import { Card, SectionHeader, Button } from "../../components/ui";
import toast from "react-hot-toast";

const PREFS_KEY = "yna_seller_prefs";
const DEFAULT_PREFS = { chime: true, emailDigest: false, lowStock: true };

const loadPrefs = () => {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") };
  } catch {
    return { ...DEFAULT_PREFS };
  }
};

const SellerSettings = () => {
  const [prefs, setPrefs] = useState(loadPrefs);

  const save = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    toast.success("Preferences saved");
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <SectionHeader eyebrow="Account" title="Settings" subtitle="Preferences for your admin experience." />
      <Card className="p-6! space-y-5">
        {[
          { key: "chime", label: "Order chime", desc: "Play a soft sound for new Order Placed events" },
          { key: "emailDigest", label: "Daily digest", desc: "Preference saved locally (email delivery not wired yet)" },
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
        <Button onClick={save} className="mt-2">
          Save preferences
        </Button>
      </Card>
    </div>
  );
};

export default SellerSettings;

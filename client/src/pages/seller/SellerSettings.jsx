/**
 * SellerSettings — admin preferences (localStorage) + chatbot system prompt (API).
 * Controls chime (Seller shell), emailDigest, lowStock (Dashboard), and chat prompt.
 * Route: /seller/settings
 */
import { useEffect, useState } from "react";
import { Card, SectionHeader, Button } from "../../components/ui";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Loader2, RotateCcw } from "lucide-react";

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
  const { axios } = useAppContext();
  const [prefs, setPrefs] = useState(loadPrefs);

  const [prompt, setPrompt] = useState("");
  const [defaultPrompt, setDefaultPrompt] = useState("");
  const [maxLength, setMaxLength] = useState(8000);
  const [promptLoading, setPromptLoading] = useState(true);
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptResetting, setPromptResetting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPrompt = async () => {
      setPromptLoading(true);
      try {
        const { data } = await axios.get("/api/chat/prompt");
        if (cancelled) return;
        if (data.success) {
          setPrompt(data.systemPrompt || "");
          setDefaultPrompt(data.defaultPrompt || "");
          if (data.maxLength) setMaxLength(data.maxLength);
        } else {
          toast.error(data.message || "Failed to load chat prompt");
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err?.response?.data?.message || "Failed to load chat prompt"
          );
        }
      } finally {
        if (!cancelled) setPromptLoading(false);
      }
    };

    loadPrompt();
    return () => {
      cancelled = true;
    };
  }, [axios]);

  const savePrefs = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    toast.success("Preferences saved");
  };

  const savePrompt = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast.error("Prompt cannot be empty");
      return;
    }
    setPromptSaving(true);
    try {
      const { data } = await axios.put("/api/chat/prompt", {
        systemPrompt: trimmed,
      });
      if (data.success) {
        setPrompt(data.systemPrompt);
        toast.success(data.message || "Chat prompt saved");
      } else {
        toast.error(data.message || "Failed to save prompt");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save prompt");
    } finally {
      setPromptSaving(false);
    }
  };

  const resetPrompt = async () => {
    setPromptResetting(true);
    try {
      const { data } = await axios.post("/api/chat/prompt/reset");
      if (data.success) {
        setPrompt(data.systemPrompt);
        toast.success(data.message || "Prompt reset to default");
      } else {
        toast.error(data.message || "Failed to reset prompt");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset prompt");
    } finally {
      setPromptResetting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl space-y-8">
      <SectionHeader
        eyebrow="Account"
        title="Settings"
        subtitle="Preferences for your admin experience and storefront chatbot."
      />

      <Card className="p-6! space-y-5">
        <h3 className="font-heading font-semibold text-text-primary text-base">
          Preferences
        </h3>
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
        <Button onClick={savePrefs} className="mt-2">
          Save preferences
        </Button>
      </Card>

      <Card className="p-6! space-y-4">
        <div>
          <h3 className="font-heading font-semibold text-text-primary text-base">
            Chatbot system prompt
          </h3>
          <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
            Controls how the storefront assistant answers customers. The live
            product catalog is always appended automatically after this prompt.
          </p>
        </div>

        {promptLoading ? (
          <div className="flex items-center gap-2 text-sm text-text-tertiary py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading prompt…
          </div>
        ) : (
          <>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, maxLength))}
              rows={14}
              maxLength={maxLength}
              className="w-full rounded-[16px] border border-border bg-bg-cream px-4 py-3 text-sm font-body text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y min-h-[220px]"
              placeholder={defaultPrompt || "Enter the chatbot system prompt…"}
              spellCheck={false}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-text-tertiary">
                {prompt.length} / {maxLength} characters
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={resetPrompt}
                  loading={promptResetting}
                  disabled={promptSaving || promptResetting}
                >
                  {!promptResetting && <RotateCcw className="w-4 h-4" />}
                  Reset to default
                </Button>
                <Button
                  onClick={savePrompt}
                  loading={promptSaving}
                  disabled={promptSaving || promptResetting || !prompt.trim()}
                >
                  Save prompt
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default SellerSettings;

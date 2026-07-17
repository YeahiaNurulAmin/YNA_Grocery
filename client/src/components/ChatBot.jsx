/**
 * ChatBot — floating customer storefront assistant (support + shopping).
 * Mounted from App.jsx on non-seller routes; calls POST /api/chat.
 */
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { Button } from "./ui";

const MAX_HISTORY = 12;
const WELCOME =
  "Hi! I’m the YNA Grocery assistant. Ask about delivery, payments, or what to buy from our catalog.";

const SUGGESTIONS = [
  "Delivery times?",
  "Fresh fruit under $5?",
  "Payment methods?",
];

const ChatBot = () => {
  const { axios } = useAppContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const sendMessage = async (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text || inFlightRef.current || loading) return;

    inFlightRef.current = true;

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const history = nextMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }));

    // Exclude the message we just sent from history (API expects prior turns + message)
    const priorHistory = history.slice(0, -1);

    try {
      const { data } = await axios.post("/api/chat", {
        message: text,
        history: priorHistory,
      });

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        const msg = data.message || "Could not get a reply.";
        toast.error(msg);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Sorry — ${msg}` },
        ]);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Chat failed. Please try again.";
      toast.error(msg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry — ${msg}` },
      ]);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="fixed z-50 right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] sm:right-6 sm:bottom-6">
      {open && (
        <div
          className="mb-3 w-[min(100vw-2rem,22rem)] h-[min(70vh,28rem)] flex flex-col rounded-card border border-border bg-bg-white shadow-[0_12px_40px_rgb(15_23_42/0.14)] overflow-hidden animate-scale-in"
          role="dialog"
          aria-label="YNA Grocery chat assistant"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-primary text-white">
            <div className="min-w-0">
              <p className="font-heading font-semibold text-sm truncate">
                YNA Assistant
              </p>
              <p className="text-xs text-white/80 truncate">
                Shopping & support
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-[12px] hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-bg-cream"
          >
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[16px] px-3.5 py-2 text-sm font-body leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-white rounded-br-[6px]"
                      : "bg-bg-white text-text-primary border border-border rounded-bl-[6px]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-[16px] rounded-bl-[6px] px-3.5 py-2 text-sm bg-bg-white border border-border text-text-tertiary">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}

            {messages.length <= 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => sendMessage(chip)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary/25 bg-bg-light-mint text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 p-3 border-t border-border bg-bg-white"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              disabled={loading}
              placeholder="Ask about products or support…"
              className="flex-1 min-w-0 h-10 px-3 rounded-[14px] border border-border bg-bg-cream text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60"
            />
            <Button
              type="submit"
              size="icon"
              loading={loading}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="shrink-0"
            >
              {!loading && <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-250 cursor-pointer active:scale-95"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatBot;

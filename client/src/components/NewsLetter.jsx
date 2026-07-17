/**
 * NewsLetter — email capture UI on Home.
 * No newsletter API exists; reports unavailable instead of fake success.
 */
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button, Card } from "./ui";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.error("Newsletter signup is not available yet.");
  };

  return (
    <section className="mt-16 md:mt-24 mb-8">
      <Card className="p-0! overflow-hidden gradient-fresh border-primary/10">
        <div className="px-6 py-12 md:px-12 md:py-16 text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-[18px] bg-primary/15 text-primary flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
            Stay in the fresh loop
          </h2>
          <p className="mt-3 text-text-secondary text-sm md:text-base">
            Seasonal offers, restocks, and recipes — no spam, just good groceries.
          </p>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 h-12 px-4 rounded-[16px] bg-bg-white border border-border text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              aria-label="Email address"
            />
            <Button type="submit" size="md" className="sm:shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default NewsLetter;

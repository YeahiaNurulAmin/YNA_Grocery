/**
 * MainBanner — full-bleed hero for Home. Brand-forward Apple-inspired composition.
 * Used only on the Home page. Imagery is minimal editorial produce photography.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { assets } from "../assets/assets";
import { Button } from "./ui";

const MainBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-[24px] md:rounded-[28px] gradient-hero border border-border/40 shadow-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative grid md:grid-cols-2 gap-8 items-center min-h-[420px] md:min-h-[520px] px-6 py-12 md:px-12 lg:px-16">
        <div className="animate-slide-up z-10">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Fresh groceries, delivered with care
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-text-primary leading-[1.08] tracking-tight max-w-lg">
            YNA Grocery
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-secondary max-w-md leading-relaxed">
            Premium produce and everyday essentials, curated for busy households across the Middle East.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link to="/products">
              <Button size="lg">
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" size="lg" className="text-accent hover:text-accent-dark">
                Explore deals
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative hidden md:block h-full min-h-[360px]">
          <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-lg bg-bg-white ring-1 ring-border/50">
            <img
              src={assets.main_banner_bg}
              alt="Fresh premium produce"
              className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="md:hidden rounded-[20px] overflow-hidden shadow-md ring-1 ring-border/50 bg-bg-white">
          <img
            src={assets.main_banner_bg_sm}
            alt="Fresh premium produce"
            className="w-full h-56 object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default MainBanner;

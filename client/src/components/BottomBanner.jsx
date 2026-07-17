/**
 * BottomBanner — trust / value props section on Home.
 */
import { Truck, Leaf, BadgeDollarSign, ShieldCheck } from "lucide-react";
import { assets } from "../assets/assets";
import { SectionHeader, Card } from "./ui";

const trustItems = [
  { icon: Truck, title: "Fast delivery", description: "Groceries at your door when you need them." },
  { icon: Leaf, title: "Farm-fresh quality", description: "Produce sourced for peak freshness." },
  { icon: BadgeDollarSign, title: "Fair prices", description: "Premium quality without the markup." },
  { icon: ShieldCheck, title: "Trusted by families", description: "Loved by busy households across the region." },
];

const BottomBanner = () => {
  return (
    <section className="mt-16 md:mt-24">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative overflow-hidden rounded-[24px] shadow-md ring-1 ring-border/40 bg-bg-white">
          <img
            src={assets.bottom_banner_image}
            alt="Fresh groceries curated with care"
            className="hidden md:block w-full h-[420px] object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
          />
          <img
            src={assets.bottom_banner_image_sm}
            alt="Fresh groceries curated with care"
            className="md:hidden w-full h-64 object-cover object-center"
          />
        </div>

        <div>
          <SectionHeader
            eyebrow="Why YNA"
            title="Built for how you actually shop"
            subtitle="Clean browsing, reliable delivery, and groceries you can trust."
            className="mb-6"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {trustItems.map((item) => (
              <Card key={item.title} className="p-4!" hover>
                <div className="w-10 h-10 rounded-[14px] bg-bg-light-mint text-primary flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading font-semibold text-text-primary text-sm">{item.title}</h3>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomBanner;

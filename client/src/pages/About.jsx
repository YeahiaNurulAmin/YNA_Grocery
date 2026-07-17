/**
 * About — brand story page.
 * Route: /about
 */
import { Leaf, Heart, Truck } from "lucide-react";
import { Card, SectionHeader } from "../components/ui";

const About = () => (
  <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-4xl mx-auto">
    <SectionHeader
      eyebrow="Our story"
      title="Fresh groceries, delivered with care"
      subtitle="YNA Grocery brings Apple-like clarity to everyday shopping for families across Saudi Arabia and the Middle East."
    />
    <Card className="p-8! mb-8 gradient-fresh border-primary/10">
      <p className="text-text-secondary leading-relaxed">
        We believe grocery shopping should feel calm, fast, and trustworthy. From farm-fresh produce
        to pantry staples, every product is curated for quality — and every screen is designed for
        effortless browsing, even when you’re not ready to buy.
      </p>
    </Card>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { icon: Leaf, title: "Fresh first", text: "Quality produce and essentials you can trust." },
        { icon: Heart, title: "Family-focused", text: "Built for busy households and young professionals." },
        { icon: Truck, title: "Reliable delivery", text: "Fast fulfillment when it matters most." },
      ].map(({ icon: Icon, title, text }) => (
        <Card key={title} className="p-5!" hover>
          <div className="w-10 h-10 rounded-[14px] bg-bg-light-mint text-primary flex items-center justify-center mb-3">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary mt-1">{text}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default About;

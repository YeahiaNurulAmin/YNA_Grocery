/**
 * FAQ — frequently asked questions accordion.
 * Route: /faq
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, SectionHeader } from "../components/ui";

const faqs = [
  { q: "How fast is delivery?", a: "Most orders in covered areas arrive the same day. Exact windows depend on your city and order time." },
  { q: "What payment methods do you accept?", a: "Cash on delivery and online payment via Stripe are both supported at checkout." },
  { q: "Can I change my delivery address?", a: "Add a new address from checkout or the Add Address page, then select it before placing your order." },
  { q: "How do refunds work?", a: "Contact support with your order ID. Eligible refunds are processed according to our return policy." },
  { q: "Do you deliver outside major cities?", a: "We’re expanding across Saudi Arabia and the Middle East. Check availability at checkout." },
  { q: "Are products organic?", a: "Many items are organic or farm-fresh. Product pages list category and quality details." },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
      <SectionHeader
        eyebrow="Help"
        title="Frequently asked questions"
        subtitle="Quick answers about shopping, delivery, and payments."
      />
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <Card key={i} className="p-0! overflow-hidden" padding={false}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <span className="font-heading font-semibold text-text-primary text-sm md:text-base">
                {item.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-tertiary shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed animate-fade-in">
                {item.a}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

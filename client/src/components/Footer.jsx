/**
 * Footer — site-wide footer for customer routes with brand, links, social.
 */
import { Link } from "react-router-dom";
import { YNALogo } from "../assets/YNALogo";
import { Share2 } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { text: "Home", url: "/" },
      { text: "All Products", url: "/products" },
      { text: "Contact", url: "/contact" },
      { text: "FAQ", url: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About", url: "/about" },
      { text: "Privacy Policy", url: "/privacy" },
      { text: "Terms of Service", url: "/terms" },
      { text: "My Orders", url: "/my-orders" },
    ],
  },
  {
    title: "Help",
    links: [
      { text: "Delivery Info", url: "/faq" },
      { text: "Returns", url: "/faq" },
      { text: "Payment Methods", url: "/faq" },
      { text: "Track Order", url: "/my-orders" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <YNALogo size="medium" />
            <p className="mt-5 text-sm text-text-secondary leading-relaxed max-w-sm">
              Fresh groceries, delivered with care. Premium produce and everyday essentials for families across Saudi Arabia and the Middle East.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {["Instagram", "Twitter", "Facebook", "YouTube"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-[14px] border border-border flex items-center justify-center text-text-tertiary hover:text-accent hover:border-accent/40 transition-colors"
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading font-semibold text-text-primary text-sm mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      to={link.url}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3 text-xs text-text-tertiary">
          <p>© {new Date().getFullYear()} YNA Grocery. All rights reserved.</p>
          <p>Fresh groceries, delivered with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

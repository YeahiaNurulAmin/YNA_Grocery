/**
 * Footer — site-wide footer for customer routes with brand, links, social.
 */
import { Link } from "react-router-dom";
import { YNALogo } from "../assets/YNALogo";

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

const socialLinks = [
  { label: "Instagram", icon: InstagramIcon, url: "https://instagram.com" },
  { label: "Twitter", icon: TwitterIcon, url: "https://twitter.com" },
  { label: "Facebook", icon: FacebookIcon, url: "https://facebook.com" },
  { label: "YouTube", icon: YoutubeIcon, url: "https://youtube.com" },
];

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
              {socialLinks.map(({ label, icon: Icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-10 h-10 rounded-[14px] border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
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

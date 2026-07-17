/**
 * Privacy — privacy policy content page.
 * Route: /privacy
 */
import { SectionHeader, Card } from "../components/ui";

const Privacy = () => (
  <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
    <SectionHeader eyebrow="Legal" title="Privacy Policy" subtitle="How we collect and use your information." />
    <Card className="!p-6 md:!p-8 space-y-4 text-sm text-text-secondary leading-relaxed">
      <p>We collect account details, order history, and delivery addresses to fulfill purchases and improve the storefront experience.</p>
      <p>Payment processing for online orders is handled by Stripe. We do not store full card numbers on our servers.</p>
      <p>Cookies and local storage may be used for cart state, theme preference, and session continuity.</p>
      <p>We do not sell personal data. Contact hello@ynagrocery.com for privacy requests.</p>
      <p className="text-xs text-text-tertiary pt-2">Last updated: July 2026</p>
    </Card>
  </div>
);

export default Privacy;

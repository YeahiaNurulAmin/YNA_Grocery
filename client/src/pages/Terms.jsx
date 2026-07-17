/**
 * Terms — terms of service content page.
 * Route: /terms
 */
import { SectionHeader, Card } from "../components/ui";

const Terms = () => (
  <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
    <SectionHeader eyebrow="Legal" title="Terms of Service" subtitle="Guidelines for using YNA Grocery." />
    <Card className="!p-6 md:!p-8 space-y-4 text-sm text-text-secondary leading-relaxed">
      <p>By using YNA Grocery you agree to provide accurate account and delivery information and to use the service lawfully.</p>
      <p>Prices, availability, and promotions may change. Orders are confirmed subject to stock and payment authorization.</p>
      <p>Delivery times are estimates. Refunds and cancellations follow our support policies for eligible cases.</p>
      <p>Seller/admin access is restricted to authorized operators. Misuse may result in account suspension.</p>
      <p className="text-xs text-text-tertiary pt-2">Last updated: July 2026</p>
    </Card>
  </div>
);

export default Terms;

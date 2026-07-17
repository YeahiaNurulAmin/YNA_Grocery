/**
 * SellerProfile — UI-only admin profile card.
 * Route: /seller/profile
 */
import { Card, SectionHeader, Badge } from "../../components/ui";
import { User } from "lucide-react";

const SellerProfile = () => (
  <div className="animate-fade-in max-w-xl">
    <SectionHeader eyebrow="Account" title="Profile" subtitle="Seller admin identity for this store." />
    <Card className="p-6!">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-[20px] bg-primary/15 text-primary flex items-center justify-center">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold">Admin</h3>
          <p className="text-sm text-text-secondary">YNA Grocery Seller</p>
          <Badge variant="success" className="mt-2">Active</Badge>
        </div>
      </div>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between border-b border-border pb-3">
          <dt className="text-text-tertiary">Role</dt>
          <dd className="font-medium">Seller / Admin</dd>
        </div>
        <div className="flex justify-between border-b border-border pb-3">
          <dt className="text-text-tertiary">Access</dt>
          <dd className="font-medium">Products, Orders, Coupons</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-tertiary">Auth</dt>
          <dd className="font-medium">Env credentials · JWT cookie</dd>
        </div>
      </dl>
    </Card>
  </div>
);

export default SellerProfile;

/**
 * RecentlyViewed — UI-only recently viewed products placeholder.
 * Route: /recently-viewed
 */
import { History } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, Button, SectionHeader } from "../components/ui";

const RecentlyViewed = () => (
  <div className="py-10 md:py-14 mb-nav animate-fade-in max-w-3xl mx-auto">
    <SectionHeader
      eyebrow="Browse"
      title="Recently viewed"
      subtitle="Pick up where you left off — history sync coming soon."
    />
    <EmptyState
      icon={History}
      title="No recent views yet"
      description="Products you open will appear here for quick return visits."
      action={
        <Link to="/products">
          <Button variant="outline">Explore catalog</Button>
        </Link>
      }
    />
  </div>
);

export default RecentlyViewed;

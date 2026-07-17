/**
 * NotFound — 404 page for unknown customer routes.
 * Route: *
 */
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button, EmptyState } from "../components/ui";

const NotFound = () => (
  <div className="py-20 mb-nav">
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="That link doesn’t lead anywhere. Head home or keep shopping."
      action={
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">Shop</Link>
          </Button>
        </div>
      }
    />
  </div>
);

export default NotFound;

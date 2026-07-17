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
          <Link to="/"><Button>Go home</Button></Link>
          <Link to="/products"><Button variant="outline">Shop</Button></Link>
        </div>
      }
    />
  </div>
);

export default NotFound;

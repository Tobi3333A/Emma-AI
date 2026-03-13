import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function MarketingNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isBlog = location.pathname === "/blog" || location.pathname.startsWith("/blog/");

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center text-background font-bold text-sm font-mono">
            E
          </div>
          <span className="font-display font-bold text-lg text-foreground">EmmaAI</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isBlog && (
            <Link to="/">
              <Button variant="ghost" className="text-primary hover:text-primary/90 text-sm font-medium">
                Home
              </Button>
            </Link>
          )}
          <Link to="/blog">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
              Blog
            </Button>
          </Link>

          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="btn-teal text-sm">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-teal text-sm">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


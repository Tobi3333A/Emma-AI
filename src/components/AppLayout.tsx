import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Search, TrendingUp, Shield, Settings, LogOut, ChevronRight, Menu, X,
  Sparkle
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Search, label: "Run Query", path: "/monitor" },
  { icon: FileCode2, label: "Generate Site", path: "/generate" },
  { icon: TrendingUp, label: "Optimization", path: "/optimize" },
  { icon: Shield, label: "Ethics Monitor", path: "/ethics" },
  { icon: Sparkle, label: "Joir", path: "/joir" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center text-background font-bold font-mono text-sm flex-shrink-0">
          E
        </div>
        <div>
          <div className="font-display font-bold text-sm text-sidebar-foreground">EmmaAI</div>
          <div className="text-xs text-muted-foreground">AI Visibility Platform</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "nav-item group",
              location.pathname === path && "active"
            )}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
            {location.pathname === path && (
              <ChevronRight size={12} className="ml-auto text-primary" />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">Links</div>
          <div className="space-y-0.5">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="nav-item block"
            >
              <span>Home</span>
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className="nav-item block"
            >
              <span>Blog</span>
            </Link>
          </div>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3 mb-3">
          <div className="text-xs text-muted-foreground mb-1">Signed in as</div>
          <div className="text-xs font-medium text-foreground truncate">{user?.email}</div>
        </div>
        <button
          onClick={handleSignOut}
          className="nav-item w-full text-left hover:text-destructive"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-40">
        <NavContent />
      </aside>

      {/* Mobile header + drawer */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between h-14 px-4 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-teal flex items-center justify-center text-background font-bold font-mono text-xs">E</div>
          <span className="font-display font-bold text-sm">EmmaAI</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground hover:text-foreground">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur" />
          <aside className="absolute inset-y-0 left-0 w-56 flex flex-col bg-sidebar border-r border-sidebar-border" onClick={e => e.stopPropagation()}>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-56 pt-0 md:pt-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

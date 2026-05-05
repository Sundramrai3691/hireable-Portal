import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  FileSearch,
  Kanban,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/lib/placemate";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Resume Scorer", href: "/scorer", icon: FileSearch },
  { label: "Experiences", href: "/experiences", icon: MessageSquare },
  { label: "Tracker", href: "/tracker", icon: Kanban },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const readinessScore = user?.readinessScore ?? 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto flex h-18 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/15 text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.18)]">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">PlaceMate</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Placement Command Center</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "text-blue-300 text-glow" : "text-slate-300 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <span
                    className={`absolute inset-x-4 -bottom-[10px] h-0.5 rounded-full bg-blue-400 transition ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-200">
                Readiness: {readinessScore}%
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 font-semibold text-white">
                  {getInitials(user.name)}
                </div>
                <div className="pr-2">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs text-slate-400 transition hover:text-rose-300"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-white/10 bg-[#0a0f1ef2] px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive ? "bg-blue-500/15 text-blue-200" : "text-slate-300 hover:bg-white/5"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              {isAuthenticated ? (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button variant="hero" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

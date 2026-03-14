import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import {
  Home,
  Tv2,
  GraduationCap,
  Gamepad2,
  ShoppingBag,
  User,
  LogIn,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/entertainment", label: "Entertain", icon: Tv2 },
  { href: "/academics", label: "Academics", icon: GraduationCap },
  { href: "/gaming", label: "Gaming", icon: Gamepad2 },
  { href: "/store", label: "Store", icon: ShoppingBag },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Hide on auth pages
  if (["/login", "/signup"].includes(location.pathname)) return null;

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const initial =
    user?.full_name?.charAt(0) ||
    user?.first_name?.charAt(0) ||
    user?.email?.charAt(0) ||
    "U";

  return (
    <>
      {/* Spacer so page content isn't hidden behind the nav */}
      <div className="h-20 lg:hidden" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Frosted glass background */}
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <div className="flex items-stretch">
            {/* Main nav items */}
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  to={href}
                  className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative group min-w-0"
                >
                  {/* Top active indicator */}
                  <span
                    className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-purple-600 transition-all duration-300 ${
                      active ? "w-8 opacity-100" : "w-0 opacity-0"
                    }`}
                  />

                  {/* Icon container */}
                  <span
                    className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-400 group-active:bg-gray-50 group-active:scale-90"
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 1.8}
                    />
                  </span>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-medium leading-none truncate w-full text-center px-0.5 transition-colors duration-200 ${
                      active ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}

            {/* Auth slot */}
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-w-0">
                <div className="w-10 h-8 rounded-xl bg-gray-100 animate-pulse" />
                <div className="w-8 h-2 rounded bg-gray-100 animate-pulse mt-0.5" />
              </div>
            ) : isAuthenticated ? (
              <Link
                to="/profile"
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative group min-w-0"
              >
                <span
                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-purple-600 transition-all duration-300 ${
                    isActive("/profile") ? "w-8 opacity-100" : "w-0 opacity-0"
                  }`}
                />
                <span
                  className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200 ${
                    isActive("/profile")
                      ? "bg-purple-50"
                      : "group-active:bg-gray-50 group-active:scale-90"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm transition-all duration-200 ${
                      isActive("/profile") ? "ring-2 ring-purple-400 ring-offset-1" : ""
                    }`}
                  >
                    {initial}
                  </div>
                </span>
                <span
                  className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                    isActive("/profile") ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Profile
                </span>
              </Link>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 group min-w-0"
              >
                <span className="flex items-center justify-center w-10 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white transition-all duration-200 group-active:scale-90 shadow-sm shadow-purple-200">
                  <LogIn size={18} strokeWidth={2} />
                </span>
                <span className="text-[10px] font-semibold leading-none text-purple-600">
                  Sign In
                </span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

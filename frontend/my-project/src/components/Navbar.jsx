import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
} from "lucide-react";
import { AppContext } from "../context/Context";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUrl";

const navLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Products", to: "/products", icon: ShoppingBag },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);
  const { cartCount } = useContext(AppContext);
  const { user, isAdmin, isAuthenticated } = useAuth();

  const userId = user?._id;
  const avatarUrl = getImageUrl(user?.avatar);
  const initial = (user?.firstName || user?.email || "U").charAt(0).toUpperCase();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-br from-indigo-900/90 via-violet-900/90 to-blue-900/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 text-sm font-bold text-white shadow-lg">
            F
          </div>
          <span
            className="text-lg font-semibold tracking-wide text-white"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Folio
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive(to)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                location.pathname.startsWith("/admin")
                  ? "bg-amber-400/20 text-amber-300"
                  : "text-amber-300/70 hover:bg-amber-400/10 hover:text-amber-300"
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors duration-150 hover:border-white/20 hover:text-white"
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-pink-500 px-1 text-[10px] font-semibold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/80 transition-colors duration-150 hover:border-white/20 hover:text-white"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-[11px] font-semibold text-white">
                    {initial}
                  </span>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-white/[0.08] p-1.5 shadow-2xl backdrop-blur-2xl"
                  >
                    <Link
                      to={userId ? `/profile/${userId}` : "/profile"}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-amber-300/80 transition-colors duration-150 hover:bg-amber-400/10 hover:text-amber-300"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-pink-300 transition-colors duration-150 hover:bg-white/10 hover:text-pink-200"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
            >
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 sm:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(to) ? "bg-white/10 text-white" : "text-white/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    location.pathname.startsWith("/admin")
                      ? "bg-amber-400/20 text-amber-300"
                      : "text-amber-300/70"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to={userId ? `/profile/${userId}` : "/profile"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2.5 text-sm font-medium text-pink-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Users,
  Tag,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Shield,
  ArrowLeft,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Categories", to: "/admin/categories", icon: Tag },
  { label: "Reviews", to: "/admin/reviews", icon: MessageSquare },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, i) => {
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    const path = "/" + parts.slice(0, i + 1).join("/");
    return { label, path };
  });

  return (
    <nav className="flex items-center gap-1 text-sm text-white/40">
      <NavLink to="/admin" className="hover:text-white/70 transition-colors">
        Admin
      </NavLink>
      {crumbs.slice(1).map(({ label, path }) => (
        <React.Fragment key={path}>
          <ChevronRight className="h-3 w-3" />
          <NavLink to={path} className="hover:text-white/70 transition-colors">
            {label}
          </NavLink>
        </React.Fragment>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 text-sm font-bold text-white shadow-lg">
      E
          </div>
          <span className="text-lg font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>
            E-commerce Store
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map(({ label, to, icon: Icon }) => {
            const isActive =
              to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : ""}`} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* User + Back */}
        <div className="border-t border-white/10 px-4 py-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-pink-300 transition-colors hover:bg-white/5 hover:text-pink-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative flex w-64 flex-col bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <span className="text-lg font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>
                  Folio Admin
                </span>
                <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 px-3 py-4">
                {sidebarItems.map(({ label, to, icon: Icon }) => {
                  const isActive =
                    to === "/admin"
                      ? location.pathname === "/admin"
                      : location.pathname.startsWith(to);
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-white"
                          : "text-white/50 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : ""}`} />
                      {label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-white/10 px-4 py-4">
                <NavLink
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Store
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-pink-300 transition-colors hover:bg-white/5 hover:text-pink-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-white/10 bg-black/10 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Breadcrumbs />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-white/40 sm:block">
              {user?.firstName} {user?.lastName}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-xs font-semibold text-white">
              {(user?.firstName || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

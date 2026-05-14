import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Package, ShoppingCart, Users, CreditCard } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAdminAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/products", label: "Products", icon: <Package size={18} /> },
    { path: "/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { path: "/users", label: "Users", icon: <Users size={18} /> },
    { path: "/payments", label: "Payments", icon: <CreditCard size={18} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-bg-secondary border-r border-border fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-bold text-lg gold-text-gradient">ሁሌ ቅርጫ</h1>
              <p className="text-xs text-text-muted">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                location.pathname === item.path
                  ? "bg-gold/10 text-gold font-semibold"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-text-secondary text-sm">{isDark ? "Dark" : "Light"}</span>
            <button
              onClick={toggleTheme}
              className="w-12 h-6 rounded-full bg-bg-elevated border border-border relative"
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-gold"
                animate={{ left: isDark ? "2px" : "26px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-bg-secondary/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold gold-text-gradient">Admin</span>
          </div>
          <button onClick={() => setMenuOpen(true)} className="p-2">
            <Menu size={22} className="text-text-primary" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-bg-secondary z-50 lg:hidden border-r border-border"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                  <span className="font-bold gold-text-gradient">Admin</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-2">
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${
                      location.pathname === item.path
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

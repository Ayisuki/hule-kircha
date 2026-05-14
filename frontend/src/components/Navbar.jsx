import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, LogOut, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useCart } from "../context/CartContext.jsx";
import { Logo } from "./Logo.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/dashboard";

  const menuItems = [
    { label: "ዋና ገጽ", path: "/dashboard", icon: "🏠" },
    { label: "ትዕዛዞች", path: "/orders", icon: "📋" },
    { label: "ፕሮፋይል", path: "/profile", icon: "👤" },
    { label: "ስለ እኛ", path: "/about", icon: "ℹ️" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-bg-primary/80 border-b border-border/30">
        <div className="flex items-center justify-between px-4 py-3">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-bg-elevated transition-colors btn-press"
            >
              <ChevronLeft size={22} className="text-text-primary" />
            </button>
          )}

          <div className={`flex items-center gap-2 ${!isHome ? "ml-2" : ""}`}>
            <Logo size="sm" animate={false} />
            <span className="font-bold text-lg gold-text-gradient">ሁሌ ቅርጫ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-full hover:bg-bg-elevated transition-colors btn-press"
            >
              <ShoppingCart size={20} className="text-text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-full hover:bg-bg-elevated transition-colors btn-press"
            >
              <Menu size={22} className="text-text-primary" />
            </button>
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-bg-secondary z-50 shadow-2xl"
            >
              <div className="p-4 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <User size={20} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{user?.name || "እንኳን ደህና መጡ"}</p>
                      <p className="text-xs text-text-muted">{user?.phone || ""}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-bg-elevated btn-press"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all btn-press text-left ${
                      location.pathname === item.path
                        ? "bg-gold/10 text-gold"
                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/30 space-y-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-text-secondary text-sm">ጨረቃ/ፀሐይ</span>
                  <ThemeToggle size="sm" />
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors btn-press text-left"
                >
                  <LogOut size={18} />
                  <span className="font-medium">ውጣ</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

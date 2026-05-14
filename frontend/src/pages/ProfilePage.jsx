import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Moon, LogOut, ChevronRight, Shield, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { icon: <FileText size={18} />, label: "ደንብና ሁኔታዎች", action: () => alert("ደንብና ሁኔታዎች በቅርብ ጊዜ ይገኛሉ") },
    { icon: <Shield size={18} />, label: "ደህንነት", action: () => alert("ደህንነት ቅንብሮች በቅርብ ጊዜ ይገኛሉ") },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pb-8">
      <Navbar />

      <div className="px-4 pt-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-secondary rounded-2xl p-5 border border-border text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-3">
            <User size={36} className="text-gold" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
          <p className="text-text-secondary text-sm mt-1">{user?.phone}</p>
          {user?.isAdmin && (
            <span className="inline-block mt-2 bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full">
              👑 አስተዳዳሪ
            </span>
          )}
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 bg-bg-secondary rounded-2xl border border-border overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-text-secondary" />
              <span className="text-text-primary font-medium">ጨረቃ/ፀሐይ ሞድ</span>
            </div>
            <ThemeToggle size="sm" />
          </div>

          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full p-4 flex items-center justify-between border-b border-border last:border-0 hover:bg-bg-elevated transition-colors btn-press text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-text-secondary">{item.icon}</span>
                <span className="text-text-primary font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowLogoutConfirm(true)}
          className="mt-4 w-full bg-bg-secondary rounded-2xl p-4 border border-red-500/20 text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors btn-press"
        >
          <LogOut size={18} />
          <span className="font-semibold">ውጣ</span>
        </motion.button>

        <p className="text-center text-xs text-text-muted mt-6">
          ሁሌ ቅርጫ v1.0.0<br />
          © 2024 Hule Kircha Trading
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-secondary rounded-2xl p-6 w-full max-w-sm border border-border"
          >
            <h3 className="text-lg font-bold text-text-primary mb-2">መውጣት ይፈልጋሉ?</h3>
            <p className="text-text-secondary text-sm mb-5">ከመለያዎ ለመውጣት እርግጠኛ ነዎት?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-border text-text-primary font-semibold btn-press"
              >
                አትውጣ
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold btn-press"
              >
                ውጣ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

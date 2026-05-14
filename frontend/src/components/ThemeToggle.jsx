import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export const ThemeToggle = ({ size = "md" }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: "w-12 h-6",
    md: "w-14 h-7",
    lg: "w-16 h-8"
  };

  const knobSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7"
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative ${sizeClasses[size]} rounded-full cursor-pointer btn-press focus:outline-none focus:ring-2 focus:ring-gold/50`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
          : "linear-gradient(135deg, #e8e4dc 0%, #d5d0c8 100%)"
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className={`absolute top-0.5 ${isDark ? "left-0.5" : "right-0.5"} ${knobSizes[size]} rounded-full flex items-center justify-center`}
        style={{
          background: isDark
            ? "linear-gradient(135deg, #C89B3C 0%, #D4A84A 100%)"
            : "linear-gradient(135deg, #f5a623 0%, #f7b731 100%)"
        }}
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon size={size === "sm" ? 12 : size === "md" ? 14 : 16} className="text-black" />
        ) : (
          <Sun size={size === "sm" ? 12 : size === "md" ? 14 : 16} className="text-white" />
        )}
      </motion.div>
    </button>
  );
};

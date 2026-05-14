import { motion } from "framer-motion";

export const Logo = ({ size = "md", animate = true, className = "" }) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
    xl: "w-36 h-36"
  };

  return (
    <motion.div
      className={`relative ${sizes[size]} ${className}`}
      animate={animate ? { scale: [1, 1.03, 1] } : {}}
      transition={animate ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
    >
      <img
        src="/logo.png"
        alt="ሁሌ ቅርጫ"
        className="w-full h-full object-contain"
        style={{
          filter: "drop-shadow(0 0 15px rgba(200, 155, 60, 0.4))"
        }}
      />
    </motion.div>
  );
};

export const LogoText = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl"
  };

  return (
    <div className={`font-bold ${sizes[size]} ${className}`}>
      <span className="gold-text-gradient">ሁሌ ቅርጫ</span>
    </div>
  );
};

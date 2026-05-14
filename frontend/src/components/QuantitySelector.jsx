import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export const QuantitySelector = ({ quantity, onChange, min = 1, max = 100, size = "md" }) => {
  const btnSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11"
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={`${btnSizes[size]} rounded-full bg-bg-elevated border border-border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed btn-press`}
      >
        <Minus size={iconSizes[size]} className="text-text-primary" />
      </motion.button>

      <span className={`${textSizes[size]} font-bold text-text-primary w-8 text-center`}>
        {quantity}
      </span>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`${btnSizes[size]} rounded-full bg-gold text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed btn-press`}
      >
        <Plus size={iconSizes[size]} />
      </motion.button>
    </div>
  );
};

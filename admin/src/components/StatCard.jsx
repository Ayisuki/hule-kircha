import { motion } from "framer-motion";

export const StatCard = ({ title, value, icon, color = "gold", delay = 0 }) => {
  const colorMap = {
    gold: "bg-gold/10 text-gold border-gold/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`admin-card border ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color].split(" ")[0]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

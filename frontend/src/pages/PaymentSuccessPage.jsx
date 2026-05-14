import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto redirect after 5 seconds
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        >
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-text-primary text-center"
      >
        ክፍያ ተሳክቷል!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-text-secondary text-center mt-2 mb-8"
      >
        ትዕዛዝዎ በተሳካ ሁኔታ ተቀብለናል። በቅርብ ጊዜ እናገኝዎታለን።
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs space-y-3"
      >
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-gold text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 btn-press"
        >
          <ShoppingBag size={18} /> ትዕዛዞችን ይመልከቱ
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-bg-secondary border border-border text-text-primary font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 btn-press"
        >
          <Home size={18} /> ዋና ገጽ
        </button>
      </motion.div>
    </div>
  );
};

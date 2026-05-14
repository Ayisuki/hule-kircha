import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo.jsx";

export const SplashScreen = () => {
  const [phase, setPhase] = useState(0); // 0: initial, 1: logo glow, 2: text reveal, 3: fade out
  const navigate = useNavigate();

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => navigate("/login", { replace: true }), 3500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase < 3 && (
          <motion.div
            key="content"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 z-10"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: phase >= 1 ? [1, 1.05, 1] : 0.5,
                filter: phase >= 1
                  ? [
                      "drop-shadow(0 0 10px rgba(200,155,60,0.2))",
                      "drop-shadow(0 0 40px rgba(200,155,60,0.6))",
                      "drop-shadow(0 0 20px rgba(200,155,60,0.4))"
                    ]
                  : "drop-shadow(0 0 0px transparent)"
              }}
              transition={{
                opacity: { duration: 0.8 },
                scale: { duration: 1.5, repeat: phase >= 1 ? Infinity : 0, ease: "easeInOut" },
                filter: { duration: 2, repeat: phase >= 1 ? Infinity : 0, ease: "easeInOut" }
              }}
            >
              <Logo size="xl" animate={false} />
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold gold-text-gradient mb-1">
                ሁሌ ቅርጫ
              </h1>
              <p className="text-text-muted text-sm tracking-widest uppercase">
                Hule Kircha Trading
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              className="w-48 h-0.5 bg-bg-elevated rounded-full overflow-hidden mt-4"
            >
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Phone, Lock, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Logo } from "../components/Logo.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";

export const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const { login, loginLoading } = useAuth();
  const navigate = useNavigate();

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("251")) return "+" + digits;
    if (digits.startsWith("0")) return "+251" + digits.slice(1);
    if (digits.startsWith("9")) return "+251" + digits;
    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("እባክዎ ደንብና ሁኔታዎችን ያcept ያድርጉ");
      return;
    }

    const formattedPhone = formatPhone(phone);
    if (!formattedPhone.match(/^\+251[0-9]{9}$/)) {
      setError("ትክክለኛ የስልክ ቁጥር ያስገቡ (ለምሳሌ: 0911234567)");
      return;
    }

    if (pin.length < 4) {
      setError("PIN ቢያንስ 4 አሃዞች መሆን አለበት");
      return;
    }

    try {
      await login({ phone: formattedPhone, pin, name: isRegistering ? name : undefined });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "መግባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary px-5 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Logo size="lg" />
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {isRegistering ? "አዲስ መለያ ይፍጠሩ" : "እንኳን ደህና መጡ"}
          </h1>
          <p className="text-text-secondary text-sm">
            {isRegistering
              ? "መረጃዎን ያስገቡ እና ወደ ሁሌ ቅርጫ ይቀላቀሉ"
              : "ስልክ ቁጥር እና PIN ያስገቡ"
            }
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="w-full space-y-4"
        >
          {/* Name field (registration only) */}
          <AnimatePresence>
            {isRegistering && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ሙሉ ስም"
                    className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3.5 pl-11 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                    required={isRegistering}
                  />
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phone */}
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ስልክ ቁጥር (ለምሳሌ: 0911234567)"
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3.5 pl-11 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              required
            />
            <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>

          {/* PIN */}
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="PIN (ቢያንስ 4 አሃዞች)"
              maxLength={6}
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3.5 pl-11 pr-11 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              required
            />
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                agreed
                  ? "bg-gold border-gold"
                  : "border-text-muted bg-transparent"
              }`}
            >
              {agreed && <Check size={12} className="text-black" />}
            </button>
            <p className="text-xs text-text-secondary leading-relaxed">
              <button type="button" className="text-gold hover:underline">ደንብና ሁኔታዎችን</button> አንብቤ ተረድቻለሁ እና ይቀበላለሁ
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loginLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gold text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-50 btn-press"
          >
            {loginLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                {isRegistering ? "መለያ ፍጠር" : "ይግቡ"}
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

          {/* Toggle mode */}
          <p className="text-center text-sm text-text-secondary">
            {isRegistering ? "አስቀድመው መለያ አለዎት? " : "አዲስ ተጠቃሚ? "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="text-gold font-semibold hover:underline"
            >
              {isRegistering ? "ይግቡ" : "መለያ ይፍጠሩ"}
            </button>
          </p>
        </motion.form>

        {/* Telebirr Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 w-full"
        >
          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted uppercase tracking-wider">ወይም</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            type="button"
            className="w-full bg-[#2563EB] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-colors btn-press"
          >
            <span className="text-lg">📱</span>
            በ Telebirr ይቀጥሉ
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

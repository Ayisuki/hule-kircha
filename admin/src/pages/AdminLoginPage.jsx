import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Phone, ArrowRight } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth.js";

export const AdminLoginPage = () => {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const { login, loginLoading } = useAdminAuth();
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

    const formattedPhone = formatPhone(phone);
    if (!formattedPhone.match(/^\+251[0-9]{9}$/)) {
      setError("Invalid phone number format");
      return;
    }

    try {
      await login({ phone: formattedPhone, pin });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold gold-text-gradient">Admin Login</h1>
          <p className="text-text-secondary text-sm mt-1">Hule Kircha Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="admin-input pl-11"
              required
            />
            <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>

          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="PIN"
              maxLength={6}
              className="admin-input pl-11 pr-11"
              required
            />
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full admin-btn admin-btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loginLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Login <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

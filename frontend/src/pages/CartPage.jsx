import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { QuantitySelector } from "../components/QuantitySelector.jsx";
import { useCheckout } from "../hooks/useOrders.js";
import { formatPrice, getCategoryIcon } from "../utils/helpers.js";

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, deliveryTotal, finalTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const checkout = useCheckout();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setError("");
    setIsCheckingOut(true);

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const res = await checkout.mutateAsync({ items });
      const { paymentUrl } = res.data.data;

      // Redirect to Telebirr payment
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err.response?.data?.message || "ትዕዛዙ አልተሳካም። እባክዎ እንደገና ይሞክሩ።");
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={40} className="text-text-muted" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">ቅርጫዎ ባዶ ነው</h2>
            <p className="text-text-secondary text-sm mt-2 mb-6">ምርቶችን ይምረጡ እና እዚህ ይመለከቱ</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gold text-black font-bold px-6 py-3 rounded-xl btn-press"
            >
              መለማመድ ይጀምሩ
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-32">
      <Navbar />

      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-text-primary mb-4">ቅርጫዬ ({cart.length})</h1>

        <AnimatePresence mode="popLayout">
          {cart.map((item) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-secondary rounded-2xl p-4 border border-border mb-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
                  <p className="text-gold font-bold text-sm mt-1">{formatPrice(item.price)} / ፍጥነት</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 rounded-full hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors btn-press"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <QuantitySelector
                  quantity={item.quantity}
                  onChange={(qty) => updateQuantity(item.productId, qty)}
                  min={1}
                  max={item.maxOrderQty}
                  size="sm"
                />
                <p className="font-bold text-text-primary">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-secondary rounded-2xl p-4 border border-border mt-4"
        >
          <h3 className="font-semibold text-text-primary mb-3">ማጠቃለያ</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">ዋጋ</span>
              <span className="text-text-primary">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">አስረካቢ</span>
              <span className="text-text-primary">{formatPrice(deliveryTotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span className="text-text-primary">ጠቅላላ</span>
              <span className="text-gold">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </div>

      {/* Sticky Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-primary/95 backdrop-blur-lg border-t border-border p-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-sm">ጠቅላላ</span>
          <span className="text-xl font-bold text-gold">{formatPrice(finalTotal)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full bg-gold text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-50 btn-press"
        >
          {isCheckingOut ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
            />
          ) : (
            <>
              ይክፈሉ <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

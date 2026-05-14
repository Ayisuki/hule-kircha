import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Truck, Package, Check, ArrowRight } from "lucide-react";
import { useProduct } from "../hooks/useProducts.js";
import { Navbar } from "../components/Navbar.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { QuantitySelector } from "../components/QuantitySelector.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, getCategoryIcon, getCategoryColor } from "../utils/helpers.js";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" text="በመጫን ላይ..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4">
        <span className="text-5xl mb-4">😕</span>
        <h2 className="text-xl font-bold text-text-primary">ምርቱ አልተገኘም</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-gold font-semibold hover:underline"
        >
          ወደ ዋና ገጽ ይመለሱ
        </button>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const finalTotal = totalPrice + product.deliveryFee;

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <Navbar />

      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`h-64 bg-gradient-to-br ${getCategoryColor(product.category)} flex items-center justify-center relative`}
      >
        <span className="text-7xl">{getCategoryIcon(product.category)}</span>
        {product.featured && (
          <span className="absolute top-4 right-4 bg-gold text-black text-xs font-bold px-2.5 py-1 rounded-full">
            ⭐ የተመረጠ
          </span>
        )}
      </motion.div>

      {/* Product Info */}
      <div className="px-4 -mt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-secondary rounded-2xl p-5 border border-border"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gold font-semibold uppercase tracking-wider">{product.category}</span>
              <h1 className="text-xl font-bold text-text-primary mt-1">{product.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gold">{formatPrice(product.price)}</p>
              <p className="text-xs text-text-muted">ለአንድ ፍጥነት</p>
            </div>
          </div>

          <p className="text-text-secondary text-sm mt-3 leading-relaxed">{product.description}</p>

          {/* Stock badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 10
                ? "bg-green-500/20 text-green-500"
                : product.stock > 0
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-red-500/20 text-red-500"
            }`}>
              {product.stock > 10 ? "✅ በአክብሮት ይገኛል" : product.stock > 0 ? `⚠️ ${product.stock} ብቻ ቀርቷል` : "❌ አልቋል"}
            </span>
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 bg-bg-secondary rounded-2xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <Truck size={18} className="text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">አስረካቢ</p>
              <p className="text-xs text-text-secondary">{formatPrice(product.deliveryFee)} - በአዲስ አበባ ውስጥ</p>
            </div>
          </div>
        </motion.div>

        {/* Quantity & Price Calculation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 bg-bg-secondary rounded-2xl p-4 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-text-primary">ብዛት</span>
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              min={product.minOrderQty}
              max={Math.min(product.maxOrderQty, product.stock)}
              size="md"
            />
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">ዋጋ ({quantity} × {formatPrice(product.price)})</span>
              <span className="text-text-primary font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">አስረካቢ</span>
              <span className="text-text-primary font-medium">{formatPrice(product.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span className="text-text-primary">ጠቅላላ</span>
              <span className="text-gold">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 space-y-3"
        >
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || added}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 btn-press transition-all ${
              added
                ? "bg-green-500 text-white"
                : product.stock <= 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-bg-elevated border border-gold text-gold hover:bg-gold/10"
            }`}
          >
            {added ? (
              <><Check size={20} /> ተጨምሯል</>
            ) : (
              <><ShoppingCart size={20} /> ወደ ቅርጫዬ ያክሉ</>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 btn-press transition-all ${
              product.stock <= 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gold text-black hover:bg-gold-light"
            }`}
          >
            አሁን ይግዙ <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Filter, Search } from "lucide-react";
import { useProducts } from "../hooks/useProducts.js";
import { Navbar } from "../components/Navbar.jsx";
import { LoadingSpinner, SkeletonGrid } from "../components/LoadingSpinner.jsx";
import { QuantitySelector } from "../components/QuantitySelector.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, getCategoryIcon, getCategoryColor } from "../utils/helpers.js";

export const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts({ category });
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [addedIds, setAddedIds] = useState(new Set());

  const handleQuantityChange = (productId, qty) => {
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product._id] || 1;
    addToCart(product, qty);
    setAddedIds((prev) => new Set(prev).add(product._id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product._id);
        return next;
      });
    }, 2000);
  };

  const categoryInfo = {
    "የበሬ ቅርጫ": {
      icon: "🐂",
      desc: "ፕሪሚየም የበሬ ቅርጫ ሙሉ እና ግማሽ ክፍል",
      deliveryFee: 350
    },
    "በግ": {
      icon: "🐑",
      desc: "ከፍተኛ ጥራት ያለው በግ ለበዓላት",
      deliveryFee: 600
    },
    "ፍየል": {
      icon: "🐐",
      desc: "ልዩ ጣዕም ያለው ፍየል",
      deliveryFee: 600
    },
    "ቋንጣ": {
      icon: "🍖",
      desc: "ጣፋጭ ቋንጣ ለልዩ ዝግጅቶች",
      deliveryFee: 300
    }
  };

  const info = categoryInfo[category] || { icon: "📦", desc: "", deliveryFee: 350 };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <Navbar />

      {/* Category Header */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-secondary rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">{info.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{category}</h1>
              <p className="text-text-secondary text-sm mt-0.5">{info.desc}</p>
              <p className="text-xs text-gold mt-1">አስረካቢ ዋጋ: {formatPrice(info.deliveryFee)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kircha Group Info (for የበሬ ቅርጫ only) */}
      {category === "የበሬ ቅርጫ" && (
        <div className="px-4 mt-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gold/5 rounded-xl p-4 border border-gold/20"
          >
            <p className="text-sm text-text-secondary">
              <span className="text-gold font-semibold">💡 ጠቃሚ ምክር:</span> የራስዎን ቅርጫ ቡድን መፍጠር ይችላሉ። ቢያንስ 4 ሰዎች ያስፈልጋሉ።
            </p>
            <button
              onClick={() => alert("በቅርብ ጊዜ ይገኛል!")}
              className="mt-2 text-xs bg-gold text-black px-3 py-1.5 rounded-lg font-semibold btn-press"
            >
              ቡድን ፍጠር
            </button>
          </motion.div>
        </div>
      )}

      {/* Products */}
      <div className="px-4 mt-4">
        {isLoading ? (
          <SkeletonGrid count={4} />
        ) : products?.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">📭</span>
            <p className="text-text-secondary mt-3">ምርቶች አልተገኙም</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products?.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-bg-secondary rounded-2xl border border-border overflow-hidden"
              >
                <div
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="cursor-pointer"
                >
                  <div className={`h-36 bg-gradient-to-br ${getCategoryColor(product.category)} flex items-center justify-center`}>
                    <span className="text-5xl">{getCategoryIcon(product.category)}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-text-primary">{product.name}</h3>
                        <p className="text-text-secondary text-sm mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <span className="text-gold font-bold text-lg whitespace-nowrap ml-2">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 flex items-center justify-between">
                  <QuantitySelector
                    quantity={quantities[product._id] || 1}
                    onChange={(qty) => handleQuantityChange(product._id, qty)}
                    min={product.minOrderQty}
                    max={product.maxOrderQty}
                    size="sm"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-1.5 btn-press transition-all ${
                      addedIds.has(product._id)
                        ? "bg-green-500 text-white"
                        : "bg-gold text-black hover:bg-gold-light"
                    }`}
                  >
                    {addedIds.has(product._id) ? "✓ ተጨምሯል" : "ወደ ቅርጫዬ"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, TrendingUp, Clock, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { useProducts } from "../hooks/useProducts.js";
import { useOrders } from "../hooks/useOrders.js";
import { Navbar } from "../components/Navbar.jsx";
import { LoadingSpinner, SkeletonGrid } from "../components/LoadingSpinner.jsx";
import { formatPrice, getCategoryIcon, getCategoryColor } from "../utils/helpers.js";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders } = useOrders();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hk_welcome_seen");
    if (!hasSeenWelcome && user) {
      setShowWelcome(true);
      sessionStorage.setItem("hk_welcome_seen", "true");
      setTimeout(() => setShowWelcome(false), 4000);
    }
  }, [user]);

  const categories = [
    { name: "የበሬ ቅርጫ", icon: "🐂", path: "/category/የበሬ ቅርጫ", color: "from-amber-900/50 to-amber-950/50" },
    { name: "በግ", icon: "🐑", path: "/category/በግ", color: "from-emerald-900/50 to-emerald-950/50" },
    { name: "ፍየል", icon: "🐐", path: "/category/ፍየል", color: "from-orange-900/50 to-orange-950/50" },
    { name: "ቋንጣ", icon: "🍖", path: "/category/ቋንጣ", color: "from-rose-900/50 to-rose-950/50" },
  ];

  const featuredProducts = products?.filter((p) => p.featured).slice(0, 4) || [];
  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <Navbar />

      {/* Welcome Popup */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-4 mt-3 p-4 rounded-2xl bg-gold/10 border border-gold/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-gold" />
            <span className="text-gold font-semibold text-sm">እንኳን ደህና መጡ!</span>
          </div>
          <p className="text-text-secondary text-sm">
            ሰላም {user?.name}፣ ዛሬ ምን ይገዙ?
          </p>
        </motion.div>
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-muted text-xs">እንኳን ደህና መጡ</p>
            <h1 className="text-xl font-bold text-text-primary">{user?.name || "እንኳን ደህና መጡ"}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-4">
        <h2 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">ምድቦች</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(cat.path)}
              className={`relative overflow-hidden rounded-2xl p-4 text-left bg-bg-secondary border border-border hover:border-gold/30 transition-all btn-press`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-50`} />
              <div className="relative z-10">
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                <p className="font-bold text-text-primary">{cat.name}</p>
                <p className="text-xs text-text-muted mt-0.5">ይመልከቱ</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">የተመረጡ ምርቶች</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-gold text-xs font-medium flex items-center gap-1 hover:underline"
          >
            ሁሉንም ይመልከቱ <ChevronRight size={14} />
          </button>
        </div>

        {productsLoading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-bg-secondary rounded-2xl overflow-hidden border border-border hover:border-gold/30 transition-all cursor-pointer btn-press"
              >
                <div className={`h-28 bg-gradient-to-br ${getCategoryColor(product.category)} flex items-center justify-center`}>
                  <span className="text-4xl">{getCategoryIcon(product.category)}</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-text-primary text-sm truncate">{product.name}</p>
                  <p className="text-gold font-bold mt-1">{formatPrice(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">የቅርብ ጊዜ ትዕዛዞች</h2>
            <button
              onClick={() => navigate("/orders")}
              className="text-gold text-xs font-medium flex items-center gap-1 hover:underline"
            >
              ሁሉንም <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/orders`)}
                className="bg-bg-secondary rounded-xl p-3 border border-border flex items-center justify-between cursor-pointer btn-press"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <ShoppingBag size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{order.items[0]?.name}</p>
                    <p className="text-xs text-text-muted">{order.items.length} ምርት</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gold">{formatPrice(order.finalAmount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    order.status === "paid" ? "bg-green-500/20 text-green-500 border-green-500/30" :
                    order.status === "pending" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                    "bg-gray-500/20 text-gray-500 border-gray-500/30"
                  }`}>
                    {order.status === "paid" ? "ከፍለዋል" : "በመጠባበቅ ላይ"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

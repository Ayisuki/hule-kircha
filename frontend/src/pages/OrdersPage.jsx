import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight, Clock } from "lucide-react";
import { useOrders } from "../hooks/useOrders.js";
import { Navbar } from "../components/Navbar.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from "../utils/helpers.js";

export const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary pb-8">
      <Navbar />

      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-text-primary mb-4">ትዕዛዞች</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="በመጫን ላይ..." />
          </div>
        ) : orders?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-text-muted" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">እስካሁን ምንም ትዕዛዝ አልነበረዎትም</h2>
            <p className="text-text-secondary text-sm mt-2">መጀመሪያ ምርት ይምረጡ እና ትዕዛዝ ይስጡ</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-gold text-black font-bold px-6 py-2.5 rounded-xl btn-press"
            >
              መለማመድ ይጀምሩ
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {orders?.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-bg-secondary rounded-2xl p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Package size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{order.paymentRef}</p>
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={10} /> {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{item.name} × {item.quantity}</span>
                      <span className="text-text-primary font-medium">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-text-muted">አስረካቢ: {formatPrice(order.totalDeliveryFee)}</p>
                  </div>
                  <p className="text-lg font-bold text-gold">{formatPrice(order.finalAmount)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

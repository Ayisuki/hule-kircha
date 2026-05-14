import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users, ShoppingCart, DollarSign, Package,
  TrendingUp, Clock, CheckCircle, Truck
} from "lucide-react";
import { AdminNavbar } from "../components/AdminNavbar.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { adminDashboardAPI } from "../utils/api.js";
import { formatPrice, formatDate } from "../utils/helpers.js";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await adminDashboardAPI.getStats();
      return res.data.data;
    }
  });

  const stats = data?.stats || {};
  const monthlyRevenue = data?.monthlyRevenue || [];
  const categoryStats = data?.categoryStats || [];
  const recentOrders = data?.recentOrders || [];

  const COLORS = ["#C89B3C", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="min-h-screen bg-bg-primary lg:pl-64">
      <AdminNavbar />

      <main className="p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers || 0}
              icon={<Users size={22} />}
              color="blue"
              delay={0}
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders || 0}
              icon={<ShoppingCart size={22} />}
              color="purple"
              delay={0.1}
            />
            <StatCard
              title="Revenue"
              value={formatPrice(stats.totalRevenue || 0)}
              icon={<DollarSign size={22} />}
              color="green"
              delay={0.2}
            />
            <StatCard
              title="Pending"
              value={stats.pendingOrders || 0}
              icon={<Clock size={22} />}
              color="orange"
              delay={0.3}
            />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="admin-card">
              <h3 className="font-semibold text-text-primary mb-4">Monthly Revenue</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#C89B3C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#C89B3C"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="admin-card">
              <h3 className="font-semibold text-text-primary mb-4">Sales by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="totalSales"
                      nameKey="_id"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px"
                      }}
                      formatter={(value) => formatPrice(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {categoryStats.map((cat, i) => (
                  <div key={cat._id} className="flex items-center gap-1.5 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-text-secondary">{cat._id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="admin-card">
            <h3 className="font-semibold text-text-primary mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Ref</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Customer</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Items</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Amount</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Status</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-border/50 hover:bg-bg-elevated/50">
                      <td className="py-3 px-2 text-sm text-text-primary font-mono">{order.paymentRef}</td>
                      <td className="py-3 px-2 text-sm text-text-primary">{order.userId?.name}</td>
                      <td className="py-3 px-2 text-sm text-text-secondary">{order.items?.length} items</td>
                      <td className="py-3 px-2 text-sm text-gold font-semibold">{formatPrice(order.finalAmount)}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          order.status === "paid" ? "bg-green-500/20 text-green-500 border-green-500/30" :
                          order.status === "pending" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                          "bg-gray-500/20 text-gray-500 border-gray-500/30"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-text-muted">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

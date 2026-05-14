import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Filter, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import { AdminNavbar } from "../components/AdminNavbar.jsx";
import { adminOrderAPI } from "../utils/api.js";
import { formatPrice, formatDate, getStatusBadge, getStatusLabel } from "../utils/helpers.js";

export const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", { search, status: statusFilter, page }],
    queryFn: async () => {
      const res = await adminOrderAPI.getAll({ search, status: statusFilter, page, limit: 20 });
      return res.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminOrderAPI.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }
  });

  const orders = data?.orders || [];
  const totalPages = data?.pages || 1;

  const statusOptions = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const actionButtons = [
    { status: "paid", label: "Mark Paid", icon: <CheckCircle size={14} />, color: "text-green-500 hover:bg-green-500/10" },
    { status: "processing", label: "Process", icon: <Package size={14} />, color: "text-blue-500 hover:bg-blue-500/10" },
    { status: "shipped", label: "Ship", icon: <Truck size={14} />, color: "text-purple-500 hover:bg-purple-500/10" },
    { status: "delivered", label: "Deliver", icon: <CheckCircle size={14} />, color: "text-emerald-500 hover:bg-emerald-500/10" },
    { status: "cancelled", label: "Cancel", icon: <XCircle size={14} />, color: "text-red-500 hover:bg-red-500/10" }
  ];

  return (
    <div className="min-h-screen bg-bg-primary lg:pl-64">
      <AdminNavbar />

      <main className="p-4 lg:p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Orders</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by reference or item..."
              className="admin-input pl-11"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="admin-input w-40"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-card overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-text-muted">No orders found</div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Ref</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Customer</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Items</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Amount</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Status</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Date</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/50 hover:bg-bg-elevated/50"
                    >
                      <td className="py-3 px-2 text-sm font-mono text-text-primary">{order.paymentRef}</td>
                      <td className="py-3 px-2 text-sm text-text-primary">{order.userId?.name}</td>
                      <td className="py-3 px-2 text-sm text-text-secondary">{order.items?.length} items</td>
                      <td className="py-3 px-2 text-sm text-gold font-semibold">{formatPrice(order.finalAmount)}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-text-muted">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1 flex-wrap">
                          {actionButtons.map((action) => (
                            <button
                              key={action.status}
                              onClick={() => updateStatusMutation.mutate({ id: order._id, status: action.status })}
                              disabled={updateStatusMutation.isPending || order.status === action.status}
                              className={`p-1.5 rounded-lg transition-colors ${action.color} disabled:opacity-30`}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-bg-elevated text-text-primary disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <span className="text-text-secondary text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-bg-elevated text-text-primary disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

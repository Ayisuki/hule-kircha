import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, CreditCard } from "lucide-react";
import { AdminNavbar } from "../components/AdminNavbar.jsx";
import { adminPaymentAPI } from "../utils/api.js";
import { formatPrice, formatDate, getStatusBadge } from "../utils/helpers.js";

export const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payments", { search, page }],
    queryFn: async () => {
      const res = await adminPaymentAPI.getAll({ search, page, limit: 20 });
      return res.data.data;
    }
  });

  const payments = data?.payments || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="min-h-screen bg-bg-primary lg:pl-64">
      <AdminNavbar />

      <main className="p-4 lg:p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Payments</h1>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search payments..."
            className="admin-input pl-11"
          />
        </div>

        <div className="admin-card overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-text-muted">No payments found</div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Reference</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Customer</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Amount</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Telebirr ID</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Status</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/50 hover:bg-bg-elevated/50"
                    >
                      <td className="py-3 px-2 text-sm font-mono text-text-primary">{payment.paymentRef}</td>
                      <td className="py-3 px-2 text-sm text-text-primary">{payment.userId?.name}</td>
                      <td className="py-3 px-2 text-sm text-gold font-semibold">{formatPrice(payment.finalAmount)}</td>
                      <td className="py-3 px-2 text-sm text-text-secondary font-mono">
                        {payment.telebirrTransactionId || "N/A"}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-text-muted">{formatDate(payment.paidAt || payment.createdAt)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-bg-elevated text-text-primary disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <span className="text-text-secondary text-sm">Page {page} of {totalPages}</span>
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

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, UserCheck, UserX, Phone } from "lucide-react";
import { AdminNavbar } from "../components/AdminNavbar.jsx";
import { adminUserAPI } from "../utils/api.js";
import { formatDate } from "../utils/helpers.js";

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { search, page }],
    queryFn: async () => {
      const res = await adminUserAPI.getAll({ search, page, limit: 20 });
      return res.data.data;
    }
  });

  const toggleMutation = useMutation({
    mutationFn: adminUserAPI.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    }
  });

  const users = data?.users || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="min-h-screen bg-bg-primary lg:pl-64">
      <AdminNavbar />

      <main className="p-4 lg:p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Users</h1>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or phone..."
            className="admin-input pl-11"
          />
        </div>

        <div className="admin-card overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Name</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Phone</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Role</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Status</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Joined</th>
                    <th className="text-left text-text-muted text-sm font-medium py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/50 hover:bg-bg-elevated/50"
                    >
                      <td className="py-3 px-2 text-sm font-medium text-text-primary">{user.name}</td>
                      <td className="py-3 px-2 text-sm text-text-secondary">{user.phone}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.isAdmin
                            ? "bg-gold/20 text-gold"
                            : "bg-blue-500/20 text-blue-500"
                        }`}>
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.isActive
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-text-muted">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => toggleMutation.mutate(user._id)}
                          disabled={toggleMutation.isPending}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive
                              ? "text-red-400 hover:bg-red-500/10"
                              : "text-green-500 hover:bg-green-500/10"
                          } disabled:opacity-30`}
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </td>
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

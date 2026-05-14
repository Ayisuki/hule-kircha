import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAuthAPI } from "../utils/api.js";

export const useAdminAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("hk_admin_token");
      if (!token) return null;
      try {
        const res = await adminAuthAPI.getMe();
        return res.data.data.user;
      } catch {
        localStorage.removeItem("hk_admin_token");
        localStorage.removeItem("hk_admin_user");
        return null;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const loginMutation = useMutation({
    mutationFn: adminAuthAPI.login,
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      localStorage.setItem("hk_admin_token", token);
      localStorage.setItem("hk_admin_user", JSON.stringify(user));
      queryClient.setQueryData(["admin", "me"], user);
    }
  });

  const logout = () => {
    localStorage.removeItem("hk_admin_token");
    localStorage.removeItem("hk_admin_user");
    queryClient.clear();
    window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    logout
  };
};

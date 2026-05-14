import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../utils/api.js";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("hk_token");
      if (!token) return null;
      try {
        const res = await authAPI.getMe();
        return res.data.data.user;
      } catch {
        localStorage.removeItem("hk_token");
        localStorage.removeItem("hk_user");
        return null;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      localStorage.setItem("hk_token", token);
      localStorage.setItem("hk_user", JSON.stringify(user));
      queryClient.setQueryData(["auth", "me"], user);
    }
  });

  const telebirrLoginMutation = useMutation({
    mutationFn: authAPI.telebirrLogin,
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      localStorage.setItem("hk_token", token);
      localStorage.setItem("hk_user", JSON.stringify(user));
      queryClient.setQueryData(["auth", "me"], user);
    }
  });

  const forgotPINMutation = useMutation({
    mutationFn: authAPI.forgotPIN
  });

  const logout = () => {
    localStorage.removeItem("hk_token");
    localStorage.removeItem("hk_user");
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
    telebirrLogin: telebirrLoginMutation.mutateAsync,
    telebirrLoading: telebirrLoginMutation.isPending,
    forgotPIN: forgotPINMutation.mutateAsync,
    forgotPINLoading: forgotPINMutation.isPending,
    logout
  };
};

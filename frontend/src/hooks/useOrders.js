import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "../utils/api.js";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await orderAPI.getMyOrders();
      return res.data.data.orders;
    },
    staleTime: 1 * 60 * 1000
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderAPI.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};

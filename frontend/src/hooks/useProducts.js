import { useQuery } from "@tanstack/react-query";
import { productAPI } from "../utils/api.js";

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productAPI.getAll(params);
      return res.data.data.products;
    },
    staleTime: 2 * 60 * 1000
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await productAPI.getById(id);
      return res.data.data.product;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
};

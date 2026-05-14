import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hk_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("hk_admin_token");
      localStorage.removeItem("hk_admin_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

export const adminAuthAPI = {
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me")
};

export const adminDashboardAPI = {
  getStats: () => api.get("/admin/dashboard")
};

export const adminProductAPI = {
  getAll: () => api.get("/products"),
  create: (data) => api.post("/admin/products", data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`)
};

export const adminOrderAPI = {
  getAll: (params) => api.get("/admin/orders", { params }),
  updateStatus: (id, data) => api.put(`/admin/orders/${id}`, data)
};

export const adminUserAPI = {
  getAll: (params) => api.get("/admin/users", { params }),
  toggleStatus: (id) => api.put(`/admin/users/${id}`)
};

export const adminPaymentAPI = {
  getAll: (params) => api.get("/admin/payments", { params })
};

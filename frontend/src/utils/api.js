import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hk_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hk_token");
      localStorage.removeItem("hk_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  telebirrLogin: (data) => api.post("/auth/telebirr", data),
  forgotPIN: (data) => api.post("/auth/forgot-pin", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data)
};

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`)
};

export const orderAPI = {
  checkout: (data) => api.post("/orders/checkout", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getOrder: (id) => api.get(`/orders/${id}`)
};

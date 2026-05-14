import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserStatus,
  getPayments
} from "../controllers/admin.controller.js";
import {
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard", getDashboard);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id", toggleUserStatus);

// Payments
router.get("/payments", getPayments);

// Products
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;

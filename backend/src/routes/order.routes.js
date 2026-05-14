import express from "express";
import { createOrder, paymentCallback, getMyOrders, getOrder } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/checkout", protect, createOrder);
router.post("/callback", paymentCallback);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrder);

export default router;

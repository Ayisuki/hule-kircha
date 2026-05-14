import express from "express";
import { login, telebirrLogin, forgotPIN, getMe, updateProfile } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/telebirr", telebirrLogin);
router.post("/forgot-pin", forgotPIN);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;

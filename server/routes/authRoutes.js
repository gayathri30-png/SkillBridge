import express from "express";
import { protect } from "../middleware/auth.js";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  testJWTConfig,
  getMe,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.get("/test-jwt-config", testJWTConfig); // Add this test route

export default router;

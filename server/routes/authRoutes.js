import express from "express";
import {
  register,
  login,
  testJWTConfig,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/test-jwt-config", testJWTConfig); // Add this test route

export default router;

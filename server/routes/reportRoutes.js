import express from "express";
import { getSystemStats } from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin"), getSystemStats);

export default router;

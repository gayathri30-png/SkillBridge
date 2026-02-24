import express from "express";
import { getHealthStatus } from "../controllers/healthController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin"), getHealthStatus);

export default router;

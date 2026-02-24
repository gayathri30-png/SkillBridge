import express from "express";
import { getSystemReports } from "../controllers/reportsController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin"), getSystemReports);

export default router;

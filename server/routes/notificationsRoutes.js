import express from "express";
import { getNotifications, createNotification, deleteNotification } from "../controllers/notificationsController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, getNotifications); // Accessible to all authenticated users
router.post("/", protect, allowRoles("admin"), createNotification);
router.delete("/:id", protect, allowRoles("admin"), deleteNotification);

export default router;

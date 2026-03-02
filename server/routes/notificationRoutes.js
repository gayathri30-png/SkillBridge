import express from "express";
import { getNotifications, markAsRead, markAllAsRead, broadcastNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.post("/broadcast", protect, allowRoles("admin"), broadcastNotification);

export default router;

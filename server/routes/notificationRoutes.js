import express from "express";
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount, broadcastNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);
router.post("/broadcast", protect, allowRoles("admin"), broadcastNotification);

export default router;

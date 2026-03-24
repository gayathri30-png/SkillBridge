import express from "express";
import { getOrCreateRoom, getUserRooms, getRoomMessages, sendMessage, getUnreadMessageCount } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get or create a room for an application
router.post("/rooms", protect, getOrCreateRoom);

// List all rooms for the current user
router.get("/rooms", protect, getUserRooms);

// Get message history for a room
router.get("/rooms/:roomId/messages", protect, getRoomMessages);

// Send a message via REST (fallback for non-socket clients)
router.post("/messages", protect, sendMessage);

// Get total unread message count
router.get("/unread-count", protect, getUnreadMessageCount);

export default router;

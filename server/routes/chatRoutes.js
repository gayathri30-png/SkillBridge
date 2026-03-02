import express from "express";
import { getOrCreateRoom, getUserRooms, getRoomMessages } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get or create a room for an application
router.post("/rooms", protect, getOrCreateRoom);

// List all rooms for the current user
router.get("/rooms", protect, getUserRooms);

// Get message history for a room
router.get("/rooms/:roomId/messages", protect, getRoomMessages);

// User also requested POST /api/chat/messages
// We can use this to send messages via REST (useful for testing or non-socket fallback)
// For now, mapping it to a logic that could be handled by a controller
router.post("/messages", protect, (req, res) => {
    res.status(501).json({ message: "Please use Socket.io for real-time messaging. REST support coming soon." });
});

export default router;

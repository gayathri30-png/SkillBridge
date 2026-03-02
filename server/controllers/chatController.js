import db from "../config/db.js";

// ─────────────────────────────────────────────
// GET OR CREATE A CHAT ROOM FOR AN APPLICATION
// ─────────────────────────────────────────────
export const getOrCreateRoom = async (req, res) => {
  const { application_id } = req.body;
  const userId = req.user.id;

  if (!application_id) return res.status(400).json({ error: "application_id required" });

  try {
    // Fetch application with job and user info
    const [apps] = await db.query(
      `SELECT a.id, a.student_id, a.job_id,
              j.title as job_title, j.posted_by as recruiter_id,
              us.name as student_name, ur.name as recruiter_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users us ON a.student_id = us.id
       JOIN users ur ON j.posted_by = ur.id
       WHERE a.id = ?`,
      [application_id]
    );

    if (apps.length === 0) return res.status(404).json({ error: "Application not found" });

    const app = apps[0];
    const roomId = `app_${application_id}`;

    // Check if room exists
    const [existing] = await db.query(
      "SELECT * FROM chat_rooms WHERE room_id = ?", [roomId]
    );

    if (existing.length > 0) {
      return res.json(existing[0]);
    }

    // Create room
    await db.query(
      `INSERT INTO chat_rooms (room_id, application_id, student_id, recruiter_id, job_title, student_name, recruiter_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [roomId, application_id, app.student_id, app.recruiter_id, app.job_title, app.student_name, app.recruiter_name]
    );

    const [newRoom] = await db.query("SELECT * FROM chat_rooms WHERE room_id = ?", [roomId]);
    res.status(201).json(newRoom[0]);
  } catch (err) {
    console.error("getOrCreateRoom error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET ALL ROOMS FOR THE LOGGED-IN USER
// ─────────────────────────────────────────────
export const getUserRooms = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const column = role === "recruiter" ? "recruiter_id" : "student_id";
    const [rooms] = await db.query(
      `SELECT * FROM chat_rooms WHERE ${column} = ? ORDER BY COALESCE(last_message_at, created_at) DESC`,
      [userId]
    );

    // Get unread count for each room
    for (const room of rooms) {
      const [unread] = await db.query(
        "SELECT COUNT(*) as count FROM messages WHERE room_id = ? AND receiver_id = ? AND is_read = 0",
        [room.room_id, userId]
      );
      room.unread_count = unread[0].count;
    }

    res.json(rooms);
  } catch (err) {
    console.error("getUserRooms error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET MESSAGES FOR A ROOM (REST history loader)
// ─────────────────────────────────────────────
export const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  try {
    const [messages] = await db.query(
      `SELECT m.*, u.name as sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.room_id = ?
       ORDER BY m.created_at ASC`,
      [roomId]
    );

    // Mark messages as read
    await db.query(
      "UPDATE messages SET is_read = 1 WHERE room_id = ? AND receiver_id = ?",
      [roomId, userId]
    );

    res.json(messages);
  } catch (err) {
    console.error("getRoomMessages error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────
// UPDATE LAST MESSAGE IN ROOM (called internally by socket handler)
// ─────────────────────────────────────────────
export const updateRoomLastMessage = async (roomId, message) => {
  try {
    await db.query(
      "UPDATE chat_rooms SET last_message = ?, last_message_at = NOW() WHERE room_id = ?",
      [message, roomId]
    );
  } catch (err) {
    console.error("updateRoomLastMessage error:", err);
  }
};

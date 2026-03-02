import db from "../config/db.js";

// GET USER NOTIFICATIONS
export const getNotifications = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 20
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

// MARK AS READ
export const markAsRead = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?";

  db.query(query, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ success: true, message: "Marked as read" });
  });
};

// MARK ALL AS READ
export const markAllAsRead = (req, res) => {
    const userId = req.user.id;
    const query = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
    
    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true, message: "All notifications marked as read" });
    });
};

// CREATE NOTIFICATION (Improved helper)
export const createNotification = (userId, type, message, targetId = null) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO notifications (user_id, type, message, target_id) VALUES (?, ?, ?, ?)";
    db.query(query, [userId, type, message, targetId], (err, result) => {
      if (err) {
        console.error("Notification creation failed:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

// ADMIN: BROADCAST NOTIFICATION TO ALL USERS
export const broadcastNotification = (req, res) => {
  const { type, message, targetId } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  const query = "INSERT INTO notifications (user_id, type, message, target_id) SELECT id, ?, ?, ? FROM users";
  
  db.query(query, [type || 'broadcast', message, targetId || null], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ 
      success: true, 
      message: `Notification broadcasted to ${result.affectedRows} users` 
    });
  });
};

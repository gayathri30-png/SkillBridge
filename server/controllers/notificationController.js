import db from "../config/db.js";

// GET USER NOTIFICATIONS
export const getNotifications = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT id, user_id, type, message, 
           CAST(is_read AS UNSIGNED) as is_read, created_at
    FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

// GET UNREAD NOTIFICATION COUNT
export const getUnreadCount = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ unread_count: results[0].count });
    }
  );
};

// MARK AS READ
export const markAsRead = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?";

  db.query(query, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ success: true, message: "Marked as read" });
  });
};

// MARK ALL AS READ
export const markAllAsRead = (req, res) => {
    const userId = req.user.id;
    const query = "UPDATE notifications SET is_read = 1 WHERE user_id = ?";
    
    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true, message: "All notifications marked as read" });
    });
};

// CREATE NOTIFICATION (helper — used by other controllers)
export const createNotification = (userId, type, message) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO notifications (user_id, type, message, is_read) VALUES (?, ?, ?, 0)";
    db.query(query, [userId, type, message], (err, result) => {
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
  const { type, message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  const query = "INSERT INTO notifications (user_id, type, message) SELECT id, ?, ? FROM users";
  
  db.query(query, [type || 'broadcast', message], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ 
      success: true, 
      message: `Notification broadcasted to ${result.affectedRows} users` 
    });
  });
};

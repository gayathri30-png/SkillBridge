import db from "../config/db.js";

// GET ALL NOTIFICATIONS
export const getNotifications = (req, res) => {
    db.query("SELECT * FROM notifications ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// CREATE NOTIFICATION
export const createNotification = (req, res) => {
    const { user_id, title, message, type } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message required" });

    db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
        [user_id || null, title, message, type || 'info'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ success: true, id: result.insertId });
        }
    );
};

// DELETE NOTIFICATION
export const deleteNotification = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM notifications WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Notification deleted" });
    });
};

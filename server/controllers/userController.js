import db from "../config/db.js";

// GET ALL USERS
export const getUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ADD USER (for admin)
export const addUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  const hash = bcrypt.hashSync(password, 10);

  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, hash, role || "student"], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      message: "User added successfully",
      id: result.insertId,
    });
  });
};

// DELETE USER (Admin only)
export const deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  });
};

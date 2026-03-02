import db from "../config/db.js";

// GET PORTFOLIO ITEMS FOR A USER
export const getPortfolioItems = (req, res) => {
  const { userId } = req.params;
  
  db.query(
    "SELECT * FROM portfolio_items WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};

// ADD PORTFOLIO ITEM
export const addPortfolioItem = (req, res) => {
  const userId = req.user.id;
  const { title, description, image_url, link_url, type, technologies } = req.body;

  if (!title) return res.status(400).json({ error: "Title is required" });

  const query = "INSERT INTO portfolio_items (user_id, title, description, image_url, link_url, type, technologies) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
  db.query(
    query,
    [userId, title, description, image_url, link_url, type || 'project', technologies],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Portfolio item added", id: result.insertId });
    }
  );
};

// DELETE PORTFOLIO ITEM
export const deletePortfolioItem = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.query(
    "DELETE FROM portfolio_items WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found or unauthorized" });
      res.json({ message: "Portfolio item deleted" });
    }
  );
};

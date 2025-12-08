import db from "../config/db.js";

export const getSkills = (req, res) => {
  db.query("SELECT * FROM skills", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
};

export const addUserSkill = (req, res) => {
  const { user_id, skill_id } = req.body;

  db.query(
    "INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)",
    [user_id, skill_id],
    (err) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ message: "Skill added successfully" });
    }
  );
};

export const getUserSkills = (req, res) => {
  const user_id = req.params.user_id;

  db.query(
    `SELECT s.id, s.name
     FROM user_skills us
     JOIN skills s ON us.skill_id = s.id
     WHERE us.user_id = ?`,
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(results);
    }
  );
};

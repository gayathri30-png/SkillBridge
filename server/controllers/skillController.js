import db from "../config/db.js";

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    const [skills] = await db.query("SELECT * FROM skills ORDER BY name ASC");
    res.json(skills);
  } catch (err) {
    console.error("Error fetching all skills:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's skills
export const getMySkills = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT 
        us.id,
        s.id AS skill_id,
        s.name,
        us.proficiency
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching user skills:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add skill
export const addSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillId, proficiency } = req.body;

    if (!skillId) {
      return res.status(400).json({ error: "Skill ID is required" });
    }

    // Check duplicate
    const [exists] = await db.query(
      "SELECT * FROM user_skills WHERE user_id = ? AND skill_id = ?",
      [userId, skillId]
    );

    if (exists.length > 0) {
      return res.status(409).json({ error: "Skill already added" });
    }

    // Insert new skill
    await db.query(
      "INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES (?, ?, ?)",
      [userId, skillId, proficiency || "Beginner"]
    );

    res.json({ message: "Skill added successfully" });
  } catch (err) {
    console.error("Error adding skill:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update proficiency
export const updateProficiency = async (req, res) => {
  try {
    const userSkillId = req.params.id;
    const { proficiency } = req.body;

    await db.query("UPDATE user_skills SET proficiency = ? WHERE id = ?", [
      proficiency,
      userSkillId,
    ]);

    const [updated] = await db.query(
      `SELECT 
        us.id,
        s.id AS skill_id,
        s.name,
        us.proficiency
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.id = ?`,
      [userSkillId]
    );

    res.json(updated[0]);
  } catch (err) {
    console.error("Error updating proficiency:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove skill
export const removeSkill = async (req, res) => {
  try {
    const userSkillId = req.params.id;

    await db.query("DELETE FROM user_skills WHERE id = ?", [userSkillId]);

    res.json({ message: "Skill removed successfully" });
  } catch (err) {
    console.error("Error removing skill:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

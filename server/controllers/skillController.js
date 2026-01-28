import db from "../config/db.js";

// Allowed proficiency values (used in AI match score)
const ALLOWED_PROFICIENCY = ["Beginner", "Intermediate", "Advanced"];

// --------------------------------
// GET ALL SKILLS (PUBLIC)
// --------------------------------
export const getAllSkills = (req, res) => {
  db.query("SELECT * FROM skills ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

// --------------------------------
// GET LOGGED-IN USER SKILLS
// --------------------------------
export const getMySkills = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT 
      us.id,
      s.id AS skill_id,
      s.name,
      us.proficiency
    FROM user_skills us
    JOIN skills s ON us.skill_id = s.id
    WHERE us.user_id = ?
    `,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    },
  );
};

// --------------------------------
// ADD SKILL TO USER
// --------------------------------
export const addSkill = (req, res) => {
  const userId = req.user.id;
  const { skillId, proficiency } = req.body;

  if (!skillId) {
    return res.status(400).json({ error: "skillId is required" });
  }

  const safeProficiency = ALLOWED_PROFICIENCY.includes(proficiency)
    ? proficiency
    : "Beginner";

  // 1. Check skill exists
  db.query(
    "SELECT id, name FROM skills WHERE id = ?",
    [skillId],
    (err, skillResults) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (skillResults.length === 0) {
        return res.status(404).json({ error: "Skill not found" });
      }

      // 2. Prevent duplicate
      db.query(
        "SELECT id FROM user_skills WHERE user_id = ? AND skill_id = ?",
        [userId, skillId],
        (err, existing) => {
          if (err) return res.status(500).json({ error: "Database error" });

          if (existing.length > 0) {
            return res.status(409).json({ error: "Skill already added" });
          }

          // 3. Insert
          db.query(
            `
            INSERT INTO user_skills (user_id, skill_id, proficiency)
            VALUES (?, ?, ?)
            `,
            [userId, skillId, safeProficiency],
            (err, result) => {
              if (err) return res.status(500).json({ error: "Database error" });

              res.status(201).json({
                success: true,
                message: "Skill added",
                skill_id: skillId,
                skill_name: skillResults[0].name,
                proficiency: safeProficiency,
              });
            },
          );
        },
      );
    },
  );
};

// --------------------------------
// UPDATE SKILL PROFICIENCY
// --------------------------------
export const updateProficiency = (req, res) => {
  const userId = req.user.id;
  const userSkillId = req.params.id;
  const { proficiency } = req.body;

  if (!ALLOWED_PROFICIENCY.includes(proficiency)) {
    return res.status(400).json({ error: "Invalid proficiency value" });
  }

  db.query(
    `
    UPDATE user_skills
    SET proficiency = ?
    WHERE id = ? AND user_id = ?
    `,
    [proficiency, userSkillId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.json({ success: true, message: "Proficiency updated" });
    },
  );
};

// --------------------------------
// REMOVE SKILL
// --------------------------------
export const removeSkill = (req, res) => {
  const userId = req.user.id;
  const userSkillId = req.params.id;

  db.query(
    `
    DELETE FROM user_skills
    WHERE id = ? AND user_id = ?
    `,
    [userSkillId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.json({ success: true, message: "Skill removed" });
    },
  );
};

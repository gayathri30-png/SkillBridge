import db from "../config/db.js";

// Get all skills - CALLBACK VERSION (works with your db.js)
export const getAllSkills = (req, res) => {
  console.log("📋 [API] Fetching all skills...");

  db.query("SELECT * FROM skills ORDER BY name ASC", (err, results) => {
    if (err) {
      console.error("❌ [API] Error fetching skills:", err);
      return res.status(500).json({
        error: "Database error",
        message: err.message,
      });
    }

    console.log(`✅ [API] Found ${results.length} skills`);

    // Log first few skills for debugging
    if (results.length > 0) {
      console.log(
        "📊 Sample skills:",
        results.slice(0, 3).map((s) => s.name)
      );
    }

    res.json(results);
  });
};

// Get user's skills - CALLBACK VERSION
export const getMySkills = (req, res) => {
  const userId = req.user.id;
  console.log(`👤 [API] Fetching skills for user ${userId}`);

  db.query(
    `SELECT us.id, s.id AS skill_id, s.name, us.proficiency
     FROM user_skills us
     JOIN skills s ON us.skill_id = s.id
     WHERE us.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error("❌ [API] Error fetching user skills:", err);
        return res.status(500).json({ error: "Database error" });
      }

      console.log(`✅ [API] User has ${results.length} skills`);
      res.json(results);
    }
  );
};

// Add skill - CALLBACK VERSION
export const addSkill = (req, res) => {
  const userId = req.user.id;
  const { skillId, proficiency } = req.body;

  console.log(`➕ [API] User ${userId} adding skill ${skillId}`);

  // 1. Check if skill exists
  db.query(
    "SELECT * FROM skills WHERE id = ?",
    [skillId],
    (err, skillResults) => {
      if (err) {
        console.error("❌ [API] Error checking skill:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (skillResults.length === 0) {
        console.log(`❌ [API] Skill ${skillId} not found`);
        return res.status(404).json({ error: "Skill not found" });
      }

      // 2. Check if already added
      db.query(
        "SELECT * FROM user_skills WHERE user_id = ? AND skill_id = ?",
        [userId, skillId],
        (err, existingResults) => {
          if (err) {
            console.error("❌ [API] Error checking duplicate:", err);
            return res.status(500).json({ error: "Database error" });
          }

          if (existingResults.length > 0) {
            console.log(`❌ [API] Skill already added for user`);
            return res.status(409).json({ error: "Skill already added" });
          }

          // 3. Add skill
          db.query(
            "INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES (?, ?, ?)",
            [userId, skillId, proficiency || "Beginner"],
            (err, insertResult) => {
              if (err) {
                console.error("❌ [API] Error adding skill:", err);
                return res.status(500).json({ error: "Database error" });
              }

              console.log(`✅ [API] Skill ${skillId} added successfully`);
              res.json({
                success: true,
                message: "Skill added successfully",
                skillId: skillId,
                skillName: skillResults[0].name,
              });
            }
          );
        }
      );
    }
  );
};

// Update proficiency - CALLBACK VERSION
export const updateProficiency = (req, res) => {
  const userSkillId = req.params.id;
  const { proficiency } = req.body;

  db.query(
    "UPDATE user_skills SET proficiency = ? WHERE id = ?",
    [proficiency, userSkillId],
    (err, result) => {
      if (err) {
        console.error("❌ [API] Error updating proficiency:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ success: true, message: "Proficiency updated" });
    }
  );
};

// Remove skill - CALLBACK VERSION
export const removeSkill = (req, res) => {
  const userSkillId = req.params.id;

  db.query(
    "DELETE FROM user_skills WHERE id = ?",
    [userSkillId],
    (err, result) => {
      if (err) {
        console.error("❌ [API] Error removing skill:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ success: true, message: "Skill removed" });
    }
  );
};

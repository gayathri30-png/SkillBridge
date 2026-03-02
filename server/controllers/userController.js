import db from "../config/db.js";
import bcrypt from "bcryptjs";

// GET ALL USERS
export const getUsers = (req, res) => {
  db.query("SELECT id, name, email, role, is_verified, created_at FROM users", (err, results) => {
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
// UPDATE USER PROFILE
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { 
    name, // Allow updating name too
    bio, 
    phone, 
    location, 
    avatar, 
    github_url, 
    linkedin_url, 
    portfolio_url, 
    resume_url 
  } = req.body;

  const query = `
    UPDATE users 
    SET name = ?, bio = ?, phone = ?, location = ?, avatar = ?, 
        github_url = ?, linkedin_url = ?, portfolio_url = ?, resume_url = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [name, bio, phone, location, avatar, github_url, linkedin_url, portfolio_url, resume_url, userId],
    (err, result) => {
      if (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
      }
      
      res.json({ 
          message: "Profile updated successfully",
          user: { name, bio, phone, location, avatar, github_url, linkedin_url, portfolio_url, resume_url }
      });
    }
  );
};

// GET CURRENT USER PROFILE (Enhanced)
export const getProfile = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT u.*, 
    (SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', us.id, 
        'skill_name', s.name, 
        'proficiency', us.proficiency, 
        'endorsements', us.endorsements,
        'years_of_experience', us.years_of_experience
      )
    ) FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as skills
    FROM users u WHERE u.id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    
    const user = results[0];
    if (typeof user.skills === 'string') user.skills = JSON.parse(user.skills);
    res.json(user);
  });
};

// ADD SKILL TO USER
export const addUserSkill = (req, res) => {
  const userId = req.user.id;
  const { skillId, proficiency, years_of_experience } = req.body;

  if (!skillId) return res.status(400).json({ error: "Skill ID is required" });

  const query = "INSERT INTO user_skills (user_id, skill_id, proficiency, years_of_experience) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE proficiency = ?, years_of_experience = ?";
  
  db.query(
    query, 
    [userId, skillId, proficiency || 'Beginner', years_of_experience || 0, proficiency, years_of_experience], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Skill updated successfully" });
    }
  );
};

// REMOVE SKILL FROM USER
export const removeUserSkill = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params; // user_skills id
  
    db.query("DELETE FROM user_skills WHERE id = ? AND user_id = ?", [id, userId], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Skill removed" });
    });
};

// GET PUBLIC PROFILE BY ID (Enhanced)
export const getUserById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT u.id, u.name, u.role, u.bio, u.location, u.avatar, 
           u.github_url, u.linkedin_url, u.portfolio_url, u.resume_url, 
           u.is_verified, u.created_at,
    (SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', us.id, 
        'skill_name', s.name, 
        'proficiency', us.proficiency, 
        'endorsements', us.endorsements
      )
    ) FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as skills
    FROM users u WHERE u.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    
    const user = results[0];
    if (typeof user.skills === 'string') user.skills = JSON.parse(user.skills);
    res.json(user);
  });
};

// ... existing code ... (verifyRecruiter onwards)
export const verifyRecruiter = (req, res) => {
  // ...
  const { id } = req.params;
  
  // 1. Get current status to toggle it, or just set to true? 
  // Let's implement toggle for flexibility, or just set to true is simpler for "Verify". 
  // The plan said "Toggle verification status".
  
  db.query("SELECT is_verified FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: "User not found" });

      const currentStatus = results[0].is_verified;
      const newStatus = !currentStatus;

      db.query("UPDATE users SET is_verified = ? WHERE id = ?", [newStatus, id], (err, result) => {
          if (err) return res.status(500).json({ error: err });
          
          res.json({ 
              message: `User ${newStatus ? 'verified' : 'unverified'} successfully`, 
              is_verified: newStatus 
          });
      });
  });
};

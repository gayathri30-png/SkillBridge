import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SAME secret everywhere
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "skillbridge_super_secret_key_2024_do_not_share_this";

const JWT_EXPIRES_IN = "7d";

// =======================
// REGISTER
// =======================
export const register = (req, res) => {
  console.log("🎯 REGISTER endpoint HIT!");
  console.log("📦 Request body:", req.body);

  let { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const allowedRoles = ["student", "recruiter", "admin"];
  if (!allowedRoles.includes(role)) role = "student";

  const hash = bcrypt.hashSync(password, 10);

  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, hash, role], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }

    // 🔐 ISSUE TOKEN ON REGISTER (CRITICAL FIX)
    const token = jwt.sign(
      {
        id: result.insertId,
        email,
        role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role,
      },
    });
  });
};

// =======================
// FORGOT PASSWORD
// =======================
export const forgotPassword = (req, res) => {
  console.log("🎯 FORGOT PASSWORD endpoint HIT!");
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    
    // Generate a simple random token (in prod use crypto)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with token and expiry
    const updateQuery = "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?";
    
    db.query(updateQuery, [resetToken, resetExpires, user.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // MOCK EMAIL SENDING
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      console.log(`\n📧 [MOCK EMAIL] To: ${email}`);
      console.log(`📧 [MOCK EMAIL] Subject: Password Reset Request`);
      console.log(`📧 [MOCK EMAIL] Body: You requested a password reset. Click here: ${resetUrl}`);
      console.log(`📧 [MOCK EMAIL] Token: ${resetToken}\n`);

      return res.json({ 
        success: true, 
        message: "Password reset link sent to email (Check server console for link)" 
      });
    });
  });
};

// =======================
// RESET PASSWORD
// =======================
export const resetPassword = (req, res) => {
  console.log("🎯 RESET PASSWORD endpoint HIT!");
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "New password is required" });
  }

  // Find user with valid token and unexpired time
  const query = "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()";

  db.query(query, [token], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = results[0];
    const hash = bcrypt.hashSync(password, 10);

    // Update password and clear token fields
    const updateQuery = "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?";

    db.query(updateQuery, [hash, user.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.json({ 
        success: true, 
        message: "Password has been reset successfully" 
      });
    });
  });
};

// =======================
// LOGIN
// =======================
export const login = (req, res) => {
  console.log("🎯 LOGIN endpoint HIT!");
  console.log("📦 Request body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};

// =======================
// GET CURRENT USER (/me)
// =======================
export const getMe = (req, res) => {
  // If we reach here, protect middleware has already verified the token
  // and attached decoed user to req.user
  db.query("SELECT id, name, email, role FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    res.json({
      success: true,
      user: results[0]
    });
  });
};


// =======================
// JWT CONFIG TEST
// =======================
export const testJWTConfig = (req, res) => {
  res.json({
    jwtSecretDefined: !!JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
  });
};

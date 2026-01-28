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
// JWT CONFIG TEST
// =======================
export const testJWTConfig = (req, res) => {
  res.json({
    jwtSecretDefined: !!JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
  });
};

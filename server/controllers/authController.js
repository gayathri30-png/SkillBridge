import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Use the SAME JWT secret as in middleware/auth.js
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "skillbridge_super_secret_key_2024_do_not_share_this";
const JWT_EXPIRES_IN = "7d";

// REGISTER - with detailed logging
export const register = (req, res) => {
  console.log("🎯 REGISTER endpoint HIT!");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));

  let { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    console.log("❌ Missing fields - returning 400");
    return res.status(400).json({
      error: "Missing fields",
      received: { name, email, password, role },
    });
  }

  // Ensure valid role
  const allowedRoles = ["student", "recruiter", "admin"];
  if (!role || !allowedRoles.includes(role)) {
    role = "student";
    console.log("⚠️  Role not provided or invalid, defaulting to 'student'");
  }

  console.log(`🔑 Hashing password for ${email}...`);
  const hash = bcrypt.hashSync(password, 10);

  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  console.log(`📝 SQL: ${query}`);
  console.log(`📊 Values: [${name}, ${email}, [HASHED], ${role}]`);

  // Execute query
  db.query(query, [name, email, hash, role], (err, result) => {
    if (err) {
      console.error("❌ DATABASE ERROR:");
      console.error("Code:", err.code);
      console.error("Message:", err.message);
      console.error("SQL State:", err.sqlState);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          error: "Email already exists",
          message: "This email is already registered",
        });
      }

      if (err.code === "ER_NO_SUCH_TABLE") {
        return res.status(500).json({
          error: "Database table missing",
          message: "The 'users' table doesn't exist",
          fix: "Run CREATE TABLE users in MySQL",
        });
      }

      return res.status(500).json({
        error: "Database error",
        code: err.code,
        message: err.message,
        sqlMessage: err.sqlMessage,
      });
    }

    console.log("✅ REGISTRATION SUCCESS!");
    console.log("Insert ID:", result.insertId);
    console.log("Affected rows:", result.affectedRows);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  });
};

// LOGIN - with detailed logging
export const login = (req, res) => {
  console.log("🎯 LOGIN endpoint HIT!");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({
      error: "Email and password required",
      received: { email, password: password ? "***" : null },
    });
  }

  console.log(`🔍 Searching for user: ${email}`);

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("❌ LOGIN DATABASE ERROR:");
      console.error("Code:", err.code);
      console.error("Message:", err.message);

      return res.status(500).json({
        error: "Database error",
        code: err.code,
        message: err.message,
      });
    }

    console.log(`📊 Found ${results.length} user(s) with email ${email}`);

    if (results.length === 0) {
      console.log("❌ User not found");
      return res.status(401).json({
        error: "Invalid credentials",
        message: "User not found",
      });
    }

    const user = results[0];
    console.log(
      `👤 User found: ${user.name} (ID: ${user.id}, Role: ${user.role})`
    );

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Incorrect password",
      });
    }

    console.log("✅ Password verified!");

    // Create JWT token - USING THE SAME SECRET AS MIDDLEWARE
    console.log(
      `🔐 Generating token with secret: ${JWT_SECRET.substring(0, 10)}...`
    );

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET, // Using the SAME constant as middleware
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log(`✅ Token generated for user ID: ${user.id}`);
    console.log(`📋 Token (first 50 chars): ${token.substring(0, 50)}...`);

    // Return response (remove password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
      note:
        "Use this token in Authorization header: Bearer " +
        token.substring(0, 30) +
        "...",
    });
  });
};

// Test function to verify JWT_SECRET is consistent
export const testJWTConfig = (req, res) => {
  res.json({
    jwtSecretDefined: !!JWT_SECRET,
    jwtSecretLength: JWT_SECRET ? JWT_SECRET.length : 0,
    jwtSecretPreview: JWT_SECRET
      ? JWT_SECRET.substring(0, 10) + "..."
      : "undefined",
    expiresIn: JWT_EXPIRES_IN,
    note: "This should match the secret in middleware/auth.js",
  });
};

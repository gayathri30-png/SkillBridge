// index.js - ULTRA SIMPLE WORKING VERSION
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("\n🔧 ENVIRONMENT CHECK:");
console.log("PORT:", process.env.PORT || 5001);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ Loaded" : "✗ Missing");
console.log("DB_USER:", process.env.DB_USER || "root");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// =====================
// IMPORT AND MOUNT ROUTES IMMEDIATELY
// =====================
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import applicationsRoutes from "./routes/applicationsRoutes.js";
import jobSkillsRoutes from "./routes/jobSkillsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/job-skills", jobSkillsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/health", healthRoutes);

console.log("\n✅ ALL ROUTES MOUNTED:");
console.log("✅ POST /api/auth/register");
console.log("✅ POST /api/auth/login");
console.log("✅ GET  /api/jobs");
console.log("✅ GET  /api/skills/all");
console.log("✅ GET  /api/users");

// =====================
// VERIFICATION ROUTE
// =====================
app.get("/api/verify", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    port: PORT,
    authRoutes: ["POST /api/auth/register", "POST /api/auth/login"],
    message: "If you see this, routes are mounted correctly",
  });
});

// =====================
// ROOT PAGE
// =====================
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SkillBridge API</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .success { color: green; font-weight: bold; }
        .test { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>🎯 SkillBridge API</h1>
      <p>Status: <span class="success">✅ RUNNING</span> on port ${PORT}</p>
      
      <div class="test">
        <h2>🔧 First Test This:</h2>
        <p><a href="/api/verify" target="_blank">Verify Routes</a></p>
        <p>This should return JSON confirming routes are mounted.</p>
      </div>
      
      <div class="test">
        <h2>🔐 Then Test Authentication:</h2>
        <p><strong>POST /api/auth/register</strong> - Register a new user</p>
        <p><strong>POST /api/auth/login</strong> - Login with credentials</p>
        <p><em>Use Postman or curl to test these POST endpoints</em></p>
      </div>
      
      <div class="test">
        <h2>📊 Debug Info</h2>
        <p>Check server console for detailed logs when you make requests.</p>
        <p>Your authController has excellent logging - watch the terminal!</p>
      </div>
    </body>
    </html>
  `);
});

// =====================
// 404 HANDLER
// =====================
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`\n✅ ============================================`);
  console.log(`✅ SERVER RUNNING on http://localhost:${PORT}`);
  console.log(`✅ ============================================`);
  console.log(`\n🎯 IMMEDIATE TEST:`);
  console.log(`1. GET  http://localhost:${PORT}/api/verify`);
  console.log(`2. POST http://localhost:${PORT}/api/auth/register`);
  console.log(`\n📋 Watch the terminal for authController logs!`);
});

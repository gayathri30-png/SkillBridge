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
import aiRoutes from "./routes/aiRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import interviewsRoutes from "./routes/interviewsRoutes.js";

// Socket.IO & Models for Real-time
import { createServer } from "http";
import { Server } from "socket.io";
import { createMessage, getMessagesByRoom } from "./models/Chat.js";
import { updateRoomLastMessage } from "./controllers/chatController.js";
import { createNotification } from "./controllers/notificationController.js";

// Serve Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes); // Mount upload route
app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/job-skills", jobSkillsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/interviews", interviewsRoutes);

console.log("\n✅ ALL ROUTES MOUNTED:");
console.log("✅ POST /api/auth/register");
console.log("✅ POST /api/auth/login");
console.log("✅ GET  /api/jobs");
console.log("✅ GET  /api/skills/all");
console.log("✅ GET  /api/users");

// =====================
// PUBLIC STATS ROUTE
// =====================
import db from "./config/db.js";
app.get("/api/public/stats", async (req, res) => {
  try {
    const [[{ students }]] = await db.promise().query("SELECT COUNT(*) as students FROM users WHERE role = 'student'");
    const [[{ recruiters }]] = await db.promise().query("SELECT COUNT(*) as recruiters FROM users WHERE role = 'recruiter'");
    const [[{ jobs }]] = await db.promise().query("SELECT COUNT(*) as jobs FROM jobs WHERE status = 'open'");
    
    res.json({
      students: students || 0,
      companies: recruiters || 0,
      jobs: jobs || 0
    });
  } catch (error) {
    console.error("Public stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

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
// START SERVER WITH SOCKET.IO
// =====================
// =====================
// START SERVER WITH SOCKET.IO
// =====================

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    console.log(`User matched in room: ${roomId}`);
    
    // Send history
    try {
        const history = await getMessagesByRoom(roomId);
        socket.emit("receive_history", history);
    } catch (e) {
        console.error("Error fetching history:", e);
    }
  });

  socket.on("send_message", async (data) => {
    // data = { room, author, message, senderId, receiverId }
    try {
        await createMessage(data.room, data.senderId, data.receiverId, data.message);
        // Update room's last message
        await updateRoomLastMessage(data.room, data.message);
        // Notify recipient
        await createNotification(
          data.receiverId,
          "message",
          `New message from ${data.author}`
        );
        // Broadcast to room (including sender)
        io.to(data.room).emit("receive_message", {
          ...data,
          created_at: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error saving message:", e);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`\n✅ ============================================`);
  console.log(`✅ SERVER RUNNING on http://localhost:${PORT}`);
  console.log(`✅ SOCKET.IO ACTIVE`);
  console.log(`✅ ============================================`);
});

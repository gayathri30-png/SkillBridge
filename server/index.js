import express from "express";
import cors from "cors";
import db from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationsRoutes from "./routes/applicationsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ HEALTH CHECK ROUTE
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "SkillBridge API",
    timestamp: new Date().toISOString(),
    database: db.state === "connected" ? "Connected" : "Disconnected",
  });
});

// ✅ DATABASE TEST ROUTE
app.get("/api/debug/db", (req, res) => {
  db.query("SELECT COUNT(*) as skill_count FROM skills", (err, results) => {
    if (err) {
      return res.json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    db.query("SELECT name FROM skills LIMIT 5", (err, skills) => {
      res.json({
        success: true,
        message: "Database connected",
        skill_count: results[0].skill_count,
        sample_skills: skills.map((s) => s.name),
        db_state: db.state,
      });
    });
  });
});

// ✅ API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationsRoutes);

// Root Page
app.get("/", (req, res) => {
  res.send(`
    <h1>SkillBridge API</h1>
    <p>Server is running</p>
    <ul>
      <li><a href="/health">Health Check</a></li>
      <li><a href="/api/debug/db">Database Debug</a></li>
      <li><a href="/api/skills/all">Get All Skills</a></li>
      <li><a href="/api/jobs/all">Get All Jobs</a></li>
      <li><a href="/api/applications/all">Get All Applications</a></li>
    </ul>
  `);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ DB Debug: http://localhost:${PORT}/api/debug/db`);
  console.log(`✅ Skills API: http://localhost:${PORT}/api/skills/all`);
  console.log(`✅ Jobs API: http://localhost:${PORT}/api/jobs/all`);
  console.log(
    `✅ Applications API: http://localhost:${PORT}/api/applications/all`
  );
});

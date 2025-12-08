import express from "express";
import cors from "cors";
import db from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);

app.get("/", (req, res) => {
  res.send("SkillHire API is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

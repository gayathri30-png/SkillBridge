import express from "express";
import {
  addJobSkill,
  getJobSkills,
  removeJobSkill,
} from "../controllers/jobSkillsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/*
  Recruiter routes (protected)
*/

// Add skill requirement to job
router.post("/add", protect, addJobSkill);

// Get skills for a job
router.get("/:jobId", protect, getJobSkills);

// Remove skill from job
router.delete("/remove/:id", protect, removeJobSkill);

export default router;

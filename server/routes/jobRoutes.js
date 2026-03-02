import express from "express";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobDetails,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
  getRecruiterDashboardStats
} from "../controllers/jobsController.js";

import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// CREATE JOB
router.post("/", protect, allowRoles("recruiter", "admin"), createJob);

// GET ALL JOBS
router.get(
  "/",
  protect,
  allowRoles("student", "recruiter", "admin"),
  getAllJobs
);

// GET RECRUITER JOBS
router.get("/recruiter", protect, allowRoles("recruiter", "admin"), getMyJobs);

// GET RECRUITER DASHBOARD STATS
router.get("/dashboard", protect, allowRoles("recruiter", "admin"), getRecruiterDashboardStats);

// GET JOB DETAILS
router.get(
  "/:id",
  protect,
  allowRoles("student", "recruiter", "admin"),
  getJobDetails
);

// UPDATE JOB
router.put("/:id", protect, allowRoles("recruiter", "admin"), updateJob);

// GET SAVED JOBS (Specific for students)
router.get("/saved", protect, allowRoles("student"), getSavedJobs);

// TOGGLE SAVE JOB
router.post("/save/:id", protect, allowRoles("student"), toggleSaveJob);

// DELETE JOB
router.delete("/:id", protect, allowRoles("recruiter", "admin"), deleteJob);

export default router;

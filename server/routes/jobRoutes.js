import express from "express";
import {
  createJob,
  getAllJobs,
  getJobDetails,
  deleteJob,
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

// GET JOB DETAILS
router.get(
  "/:id",
  protect,
  allowRoles("student", "recruiter", "admin"),
  getJobDetails
);

// DELETE JOB
router.delete("/:id", protect, allowRoles("admin"), deleteJob);

export default router;

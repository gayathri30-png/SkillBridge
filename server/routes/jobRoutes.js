import express from "express";
import {
  createJob,
  getAllJobs,
  getJobDetails,
} from "../controllers/jobsController.js";

const router = express.Router();

// CREATE JOB (Recruiter)
router.post("/create", createJob);

// GET ALL JOBS (Student + Recruiter)
router.get("/", getAllJobs);

// GET JOB DETAILS (Single job)
router.get("/:id", getJobDetails);

export default router;

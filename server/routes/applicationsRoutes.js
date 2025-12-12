import express from "express";
import {
  applyToJob,
  getJobApplications,
  getStudentApplications,
  updateStatus,
} from "../controllers/applicationsController.js";

const router = express.Router();

router.post("/apply", applyToJob);
router.get("/job/:job_id", getJobApplications);
router.get("/student/:student_id", getStudentApplications);
router.put("/status/:id", updateStatus);

export default router;

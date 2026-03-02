import express from "express";
import {
  applyToJob,
  getJobApplications,
  getStudentApplications,
  getJobApplicantsSorted,
  updateStatus,
  getSkillGapForJob,
  getAllApplications,
  withdrawApplication,
  acceptOffer,
  getOfferDetails
} from "../controllers/applicationsController.js";

import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// STUDENT: APPLY TO JOB
router.post(
  "/",
  protect,
  allowRoles("student"),
  applyToJob
);

// STUDENT: VIEW OWN APPLICATIONS
router.get(
  "/student",
  protect,
  allowRoles("student"),
  getStudentApplications
);

// RECRUITER: VIEW APPLICATIONS FOR JOB
router.get(
  "/job/:jobId",
  protect,
  allowRoles("recruiter", "admin"),
  getJobApplications
);

// RECRUITER: UPDATE STATUS
router.put(
  "/:id/status",
  protect,
  allowRoles("recruiter", "admin"),
  updateStatus
);

// OTHER ENDPOINTS (Keeping for logic but matching structure)
router.get("/job/:job_id/sorted", protect, allowRoles("recruiter", "admin"), getJobApplicantsSorted);
router.get("/job/:job_id/gap", protect, allowRoles("student"), getSkillGapForJob);
router.delete("/:id", protect, allowRoles("student"), withdrawApplication);
router.post("/:id/accept-offer", protect, allowRoles("student"), acceptOffer);
router.get("/:id/offer-details", protect, getOfferDetails);

export default router;

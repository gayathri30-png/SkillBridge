import express from "express";
import {
  applyToJob,
  getJobApplications,
  getStudentApplications,
  updateStatus,
  getJobApplicantsSorted,
  getSkillGapForJob,
  getAllApplications,
  withdrawApplication,
  acceptOffer,
  getOfferDetails,
  markSuggestionSent
} from "../controllers/applicationsController.js";

import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// STUDENT: APPLY TO JOB
router.post("/", protect, allowRoles("student"), applyToJob);

// STUDENT: VIEW OWN APPLICATIONS
router.get("/student", protect, allowRoles("student"), getStudentApplications);

// RECRUITER: VIEW APPLICATIONS FOR JOB
router.get("/job/:job_id", protect, allowRoles("recruiter", "admin"), getJobApplications);

// RECRUITER: UPDATE STATUS
router.put("/:id/status", protect, allowRoles("recruiter", "admin"), updateStatus);

// RECRUITER: SUGGESTION SENT (NEW ENHANCEMENT)
router.put("/:id/suggestion", protect, allowRoles("recruiter", "admin"), markSuggestionSent);

// OTHER ENDPOINTS
router.get("/job/:job_id/smart-sort", protect, allowRoles("recruiter", "admin"), getJobApplicantsSorted);
router.get("/skill-gap/:job_id", protect, allowRoles("student"), getSkillGapForJob);
router.delete("/:id", protect, allowRoles("student"), withdrawApplication);
router.post("/:id/accept-offer", protect, allowRoles("student"), acceptOffer);
router.get("/:id/offer-details", protect, getOfferDetails);
router.get("/", protect, allowRoles("admin"), getAllApplications);

export default router;

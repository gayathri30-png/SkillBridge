import express from "express";
import {
  applyToJob,
  getJobApplications,
  getStudentApplications,
  updateStatus,
  getJobApplicantsSorted,
  getSkillGapForJob
} from "../controllers/applicationsController.js";

import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// --------------------------------
// STUDENT: APPLY TO JOB
// --------------------------------
router.post(
  "/apply",
  protect,
  allowRoles("student"),
  applyToJob
);

// --------------------------------
// 🔥 RECRUITER: VIEW APPLICANTS SORTED BY AI SCORE (TOP FEATURE)
// MUST COME BEFORE /job/:job_id
// --------------------------------
router.get(
  "/job/:job_id/sorted",
  protect,
  allowRoles("recruiter", "admin"),
  getJobApplicantsSorted
);

// --------------------------------
// RECRUITER: VIEW APPLICATIONS (NORMAL ORDER)
// --------------------------------
router.get(
  "/job/:job_id",
  protect,
  allowRoles("recruiter", "admin"),
  getJobApplications
);

// --------------------------------
// 🔥 STUDENT: VIEW SKILL GAP + RECOMMENDATIONS FOR A JOB (AI ENGINE)
// --------------------------------
router.get(
  "/job/:job_id/gap",
  protect,
  allowRoles("student"),
  getSkillGapForJob
);

// --------------------------------
// STUDENT: VIEW OWN APPLICATIONS
// --------------------------------
router.get(
  "/my",
  protect,
  allowRoles("student"),
  getStudentApplications
);

// --------------------------------
// RECRUITER: UPDATE APPLICATION STATUS
// --------------------------------
router.put(
  "/status/:id",
  protect,
  allowRoles("recruiter", "admin"),
  updateStatus
);

export default router;

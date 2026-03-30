import express from "express";
import { 
  calculateMatchScore, 
  getMarketIntelligence,
  generateJobPost,
  getJobsForSkillGap,
  getSkillGapPathways,
  generateAdvancedProposal,
  getAISummary,
  getAdvancedUpskilling,
  getSavedProposals,
  updateSavedProposal,
  deleteSavedProposal,
  getRecruiterAISummary,
  evaluateApplication,
  reEvaluateApplication,
  getRecommendedJobs
} from "../controllers/aiController.js";

import { protect } from "../middleware/auth.js";

import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// Tier 1-2
router.get("/match/:jobId", protect, calculateMatchScore);
router.post("/generate-job-post", protect, allowRoles("recruiter", "admin", "student"), generateJobPost);

// Tier 4
router.get("/market-intelligence", protect, allowRoles("recruiter", "admin"), getMarketIntelligence);
router.get("/market-intelligence/:jobId", protect, allowRoles("recruiter", "admin"), getMarketIntelligence);

// Student Advanced AI (Phase 2 Specialized)
router.get("/summary", protect, getAISummary);
router.get("/advanced-upskilling", protect, getAdvancedUpskilling);
router.get("/skill-gap/jobs", protect, allowRoles("student"), getJobsForSkillGap);
router.get("/skill-gap/pathways", protect, allowRoles("student"), getSkillGapPathways);


// Recruiter Evaluation (Genuine)
router.get("/evaluate/:applicationId", protect, allowRoles("recruiter", "admin"), evaluateApplication);
router.put("/re-evaluate/:applicationId", protect, allowRoles("recruiter", "admin"), reEvaluateApplication);
router.get("/recommendations/jobs", protect, allowRoles("student"), getRecommendedJobs);

export default router;


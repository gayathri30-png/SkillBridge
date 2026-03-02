import express from "express";
import { 
  calculateMatchScore, 
  generateProposal,
  analyzeApplicationInsights,
  generateInterviewMaterials,
  compareCandidates,
  findSimilarCandidates,
  getInterviewSchedulingAdvice,
  getMarketIntelligence,
  runApplicantAutomation,
  getRecruiterCoachAdvice,
  verifySkillsAI,
  analyzeBiasAI,
  predictCLV,
  analyzeEQ,
  getFunnelOptimization,
  analyzePortfolio,
  getSkillGapPathways,
  getAISummary,
  getSavedProposals,
  generateAdvancedProposal,
  updateSavedProposal,
  deleteSavedProposal
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// Tier 1-2
router.get("/match/:jobId", protect, calculateMatchScore);
router.get("/proposal/:jobId", protect, generateProposal);
router.get("/analyze/:applicationId", protect, allowRoles("recruiter", "admin"), analyzeApplicationInsights);
router.get("/materials/:applicationId", protect, allowRoles("recruiter", "admin"), generateInterviewMaterials);
router.post("/compare", protect, allowRoles("recruiter", "admin"), compareCandidates);

// Tier 3
router.post("/source-similar", protect, allowRoles("recruiter", "admin"), findSimilarCandidates);
router.get("/scheduling-advice/:applicationId", protect, allowRoles("recruiter", "admin"), getInterviewSchedulingAdvice);

// Tier 4
router.get("/market-intelligence/:jobId", protect, allowRoles("recruiter", "admin"), getMarketIntelligence);
router.post("/automate", protect, allowRoles("recruiter", "admin"), runApplicantAutomation);

// Tier 5
router.get("/coach/:applicationId", protect, allowRoles("recruiter", "admin"), getRecruiterCoachAdvice);
router.get("/verify-skills/:studentId", protect, allowRoles("recruiter", "admin"), verifySkillsAI);

// Final Advanced Tiers
router.get("/bias-check/:applicationId", protect, allowRoles("recruiter", "admin"), analyzeBiasAI);
router.get("/clv-predict/:studentId", protect, allowRoles("recruiter", "admin"), predictCLV);
router.get("/eq-score/:applicationId", protect, allowRoles("recruiter", "admin"), analyzeEQ);
router.get("/funnel-viz/:jobId", protect, allowRoles("recruiter", "admin"), getFunnelOptimization);

// Student Advanced AI (Phase 2 Specialized)
router.post("/portfolio/analyze", protect, allowRoles("student"), analyzePortfolio);
router.get("/skill-gap/pathways", protect, allowRoles("student"), getSkillGapPathways);
router.get("/summary", protect, allowRoles("student"), getAISummary);
router.get("/proposals", protect, allowRoles("student"), getSavedProposals);
router.put("/proposals/:id", protect, allowRoles("student"), updateSavedProposal);
router.delete("/proposals/:id", protect, allowRoles("student"), deleteSavedProposal);
router.post("/proposal/advanced/:jobId", protect, allowRoles("student"), generateAdvancedProposal);

export default router;

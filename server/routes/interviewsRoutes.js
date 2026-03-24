import express from "express";
import { 
    createInterview, 
    getInterviewById, 
    respondToInterview, 
    autoInviteTopApplicants,
    getUserInterviews 
} from "../controllers/interviewsController.js";
import { protect } from "../middleware/auth.js"; // Use protect middleware

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/", createInterview);
router.get("/", getUserInterviews);
router.get("/:id", getInterviewById);
router.patch("/:id/respond", respondToInterview);
router.post("/auto-invite/:jobId", autoInviteTopApplicants);

export default router;

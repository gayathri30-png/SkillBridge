import express from "express";
import { 
  getUsers, 
  addUser, 
  deleteUser, 
  updateProfile, 
  verifyRecruiter, 
  getProfile, 
  getUserById,
  addUserSkill,
  removeUserSkill
} from "../controllers/userController.js";
import { getPortfolioItems, addPortfolioItem, deletePortfolioItem } from "../controllers/portfolioController.js";
import { getStudentReviews, submitReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// PROFILE
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/photo", protect, (req, res) => {
    // This is a placeholder since file upload is handled by /api/upload
    // But we match the endpoint request by documenting how to use it
    res.json({ message: "Use /api/upload to upload photo, then PUT /api/users/profile to update photo_url" });
});

router.get("/:id", getUserById);

export default router;

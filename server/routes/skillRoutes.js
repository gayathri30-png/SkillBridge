import express from "express";
import {
  getAllSkills,
  getMySkills,
  addSkill, // Make sure this matches!
  updateProficiency,
  removeSkill,
} from "../controllers/skillController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/all", getAllSkills);

// Protected routes (need auth token)
router.get("/my-skills", protect, getMySkills);
router.post("/add", protect, addSkill); // This is addSkill, not addUserSkill
router.put("/update/:id", protect, updateProficiency);
router.delete("/remove/:id", protect, removeSkill);

export default router;

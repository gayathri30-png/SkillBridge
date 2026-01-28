import express from "express";
import {
  getAllSkills,
  getMySkills,
  addSkill,
  updateProficiency,
  removeSkill,
} from "../controllers/skillController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/all", getAllSkills);

// Protected (student must be logged in)
router.get("/my-skills", protect, getMySkills);
router.post("/", protect, addSkill);
router.put("/:id", protect, updateProficiency);
router.delete("/:id", protect, removeSkill);

export default router;

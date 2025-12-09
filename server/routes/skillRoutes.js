import express from "express";
import {
  getAllSkills,
  getMySkills,
  addSkill,
  updateProficiency,
  removeSkill,
} from "../controllers/skillController.js";

import { protect } from "../middleware/auth.js"; // FIXED import

const router = express.Router();

// Public
router.get("/all", getAllSkills);

// Protected
router.get("/my-skills", protect, getMySkills);
router.post("/add", protect, addSkill);
router.put("/update/:id", protect, updateProficiency);
router.delete("/remove/:id", protect, removeSkill);

export default router;

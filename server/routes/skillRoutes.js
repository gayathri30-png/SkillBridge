import express from "express";
import {
  getAllSkills,
  getMySkills,
  addSkill,
  updateProficiency,
  removeSkill,
} from "../controllers/skillController.js";
import { addUserSkill, removeUserSkill } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// Public
router.get("/", getAllSkills);

// Protected (student must be logged in)
router.get("/my-skills", protect, getMySkills);
router.post("/user", protect, addUserSkill);
router.delete("/user/:skillId", protect, removeUserSkill);

// Master Skill Management (Existing)
router.post("/", protect, allowRoles("admin"), addSkill);
router.put("/:id", protect, allowRoles("admin"), updateProficiency);
router.delete("/:id", protect, allowRoles("admin"), removeSkill);

export default router;

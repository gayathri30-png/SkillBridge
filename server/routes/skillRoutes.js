import express from "express";
import {
  getSkills,
  addUserSkill,
  getUserSkills,
} from "../controllers/skillController.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/add", addUserSkill);
router.get("/:user_id", getUserSkills);

export default router;

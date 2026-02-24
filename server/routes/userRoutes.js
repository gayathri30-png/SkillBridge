import express from "express";
import { getUsers, addUser, deleteUser, verifyUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin"), getUsers);
router.post("/", protect, allowRoles("admin"), addUser);
router.patch("/:id/verify", protect, allowRoles("admin"), verifyUser);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

export default router;

import express from "express";
import { getUsers, addUser, deleteUser, verifyRecruiter } from "../controllers/userController.js";
import { getAllApplications } from "../controllers/applicationsController.js";
import { getSystemStats } from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

// Middleware to ensure only admins can access these routes
router.use(protect);
router.use(allowRoles("admin"));

// USERS
router.get("/users", getUsers);
router.post("/users", addUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/verify", verifyRecruiter);

// APPLICATIONS
router.get("/applications", getAllApplications);

// REPORTS
router.get("/reports", getSystemStats);

export default router;

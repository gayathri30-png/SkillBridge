import express from "express";
import { getPortfolioItems, addPortfolioItem, deletePortfolioItem } from "../controllers/portfolioController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET PORTFOLIO (Usually by userId, but user requested GET /api/portfolio for current user)
// We'll adapt addPortfolioItem if needed, but for now matching the list:
// GET /api/portfolio -> Probably my portfolio
router.get("/", protect, (req, res, next) => {
    req.params.userId = req.user.id;
    next();
}, getPortfolioItems);

// User also requested GET /api/portfolio/:userId profile view in original logic?
// The list just says GET /api/portfolio
// I'll keep the param version for public view as well if needed, but matching request first
router.get("/:userId", getPortfolioItems);

// POST /api/portfolio/projects
router.post("/projects", protect, (req, res, next) => {
    req.body.type = 'project';
    next();
}, addPortfolioItem);

// POST /api/portfolio/certificates
router.post("/certificates", protect, (req, res, next) => {
    req.body.type = 'certificate';
    next();
}, addPortfolioItem);

// DELETE /api/portfolio/:id
router.delete("/:id", protect, deletePortfolioItem);

export default router;

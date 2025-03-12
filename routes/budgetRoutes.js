import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes
import { getBudget, setBudget, updateBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.post("/set", authMiddleware, setBudget);
router.get("/get", authMiddleware, getBudget);
router.put("/update", authMiddleware, updateBudget);


export default router;
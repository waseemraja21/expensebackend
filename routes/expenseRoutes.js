import express from "express";
import { addExpense, getExpenses, deleteExpense, updateExpense, currentMonthExpenses, getExpensesByCategory, getMonthlyExpenses } from "../controllers/expenseControllers.js"
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes

const router = express.Router();

router.post("/add", authMiddleware, addExpense);
router.get("/all", authMiddleware, getExpenses);
router.get("/currmonth", authMiddleware, currentMonthExpenses);
router.get("/bycategory", authMiddleware, getExpensesByCategory);
router.get("/monthly", authMiddleware, getMonthlyExpenses);
router.delete("/delete/:id", authMiddleware, deleteExpense);
router.put("/update/:id", authMiddleware, updateExpense);

export default router;
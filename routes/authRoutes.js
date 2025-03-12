import express from "express";
import { Login, Me, Logout, Register } from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

//Registration Route
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

router.get("/me", authMiddleware, Me);


export default router;
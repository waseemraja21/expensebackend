import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();
app.use(express.json({ extended: true }));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.get("/", (req, res) => {
    res.send("Backend is running! 🚀");
});
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
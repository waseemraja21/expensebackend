import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

// dotenv.config(); // Load environment variables

const authMiddleware = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied, no token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized, invalid token " });
        }
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(404).json({ error: "user not found!" });
        }
        // req.user = user;

        next();
    } catch (error) {
        console.log("Error in auth middleware", error.message);
        res.status(400).json({ error: "Invalid token" });
    }
};

// Use ES module export
export default authMiddleware;

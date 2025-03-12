import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const Register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!email || email.trim() === "") {
            return res.status(400).json({ error: "Email is required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });

        if (newUser) {
            // Generate JWT token and set cookie
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            console.log("User registered successfully");

            // ✅ Send response only ONCE
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                message: "User registered successfully",
            });
        } else {
            return res.status(400).json({ error: "Invalid user data." });
        }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        // Ensure user exists before accessing user.password
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const token = generateTokenAndSetCookie(user._id, res);
        user = await User.findOne({ email }).select("-password");
        const name = user.name;
        res.status(201).json({ name, email, token, userId: user._id });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ error: "Server error" });
    }
}

export const Me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const Logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }


}
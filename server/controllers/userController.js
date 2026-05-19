import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // To protect against CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// Register User: /api/users/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Please fill all the fields",
                });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

            res.cookie("token", token, cookieOptions);

        return res
            .status(201)
            .json({
                success: true,
                message: "User registered successfully",
                user: { id: user._id, name: user.name, email: user.email },
            });
    } catch (error) {
        console.error("Error in user registration:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Login User: /api/users/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Please fill all the fields",
                });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", token, cookieOptions);

        return res
            .status(200)
            .json({
                success: true,
                message: "User logged in successfully",
                user: { name: user.name, email: user.email },
            });
    } catch (error) {
        console.error("Error in user login:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Check Auth: /api/users/is-auth
export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ 
            success: true, 
            user,
            cartItems: user.cartItems || {}
        });
    } catch (error) {
        console.error("Error in checking auth:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Logout User: /api/users/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", cookieOptions);
        return res
            .status(200)
            .json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.error("Error in user logout:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // To protect against CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

//Login seller: /api/seller/login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email === process.env.SELLER_EMAIL &&
            password === process.env.SELLER_PASSWORD
        ) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            res.cookie("sellerToken", token, cookieOptions);

            return res.status(200).json({
                success: true,
                message: "Seller logged in successfully",
            });
        } else {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error in seller login:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

// check authentication: /api/seller/is-Auth
export const isSellerAuth = async (req, res) => {
    try {
        return res
            .status(200)
            .json({ success: true, message: "Seller is authenticated" });
    } catch (error) {
        console.error("Error in checking auth:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Logout Seller: /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", cookieOptions);
        return res
            .status(200)
            .json({ success: true, message: "Seller logged out successfully" });
    } catch (error) {
        console.error("Error in seller logout:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

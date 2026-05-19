// Update user CartData : /api/cart/update
import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;


        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { cartItems }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cartItems: updatedUser.cartItems
        });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: "Error updating cart", error: error.message });
    }
};



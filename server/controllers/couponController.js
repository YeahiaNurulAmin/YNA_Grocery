import Coupon from "../models/Coupon.js";

// POST /api/coupons/add
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, expiresAt } = req.body;

        if (!code || !discountType || !discountValue || !expiresAt) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const expiry = new Date(expiresAt);
        if (expiry <= new Date()) {
            return res.status(400).json({ success: false, message: "Expiry date must be in the future." });
        }

        const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
        if (existing) {
            return res.status(409).json({ success: false, message: `Coupon code "${code.toUpperCase()}" already exists.` });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase().trim(),
            discountType,
            discountValue: Number(discountValue),
            minOrderAmount: Number(minOrderAmount || 0),
            expiresAt: expiry,
            isActive: true,
        });

        return res.json({ success: true, message: "Coupon created successfully!", coupon });
    } catch (error) {
        console.error("Error creating coupon:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// GET /api/coupons/list
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return res.json({ success: true, coupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// DELETE /api/coupons/delete/:id
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }
        return res.json({ success: true, message: "Coupon deleted successfully." });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// PATCH /api/coupons/toggle/:id  - Toggle active/inactive status
export const toggleCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        return res.json({ success: true, message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}.`, coupon });
    } catch (error) {
        console.error("Error toggling coupon:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// POST /api/coupons/validate (public - used during checkout)
export const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: "Coupon code is required." });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid coupon code." });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: "This coupon is no longer active." });
        }
        if (new Date() > coupon.expiresAt) {
            return res.status(400).json({ success: false, message: "This coupon has expired." });
        }
        if (cartTotal !== undefined && Number(cartTotal) < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order of $${coupon.minOrderAmount} required for this coupon.`
            });
        }

        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (Number(cartTotal) * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }

        return res.json({
            success: true,
            message: "Coupon applied successfully!",
            discount: parseFloat(discount.toFixed(2)),
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            }
        });
    } catch (error) {
        console.error("Error validating coupon:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

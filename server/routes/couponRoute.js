import express from "express";
import {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    toggleCouponStatus,
    validateCoupon,
} from "../controllers/couponController.js";
import authSeller from "../middlewares/authSeller.js";

const couponRouter = express.Router();

// POST /api/coupons/add (admin only)
couponRouter.post("/add", authSeller, createCoupon);

// GET /api/coupons/list (admin only)
couponRouter.get("/list", authSeller, getAllCoupons);

// DELETE /api/coupons/delete/:id (admin only)
couponRouter.delete("/delete/:id", authSeller, deleteCoupon);

// PATCH /api/coupons/toggle/:id (admin only)
couponRouter.patch("/toggle/:id", authSeller, toggleCouponStatus);

// POST /api/coupons/validate (public - customer checkout)
couponRouter.post("/validate", validateCoupon);

export default couponRouter;

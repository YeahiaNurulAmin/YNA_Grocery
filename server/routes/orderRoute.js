import express from "express";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";
import { getAllOrders, getOrdersByUserId, placeOrderCOD, placeOrderOnline, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place Order COD: /api/order/cod
orderRouter.post("/cod", authUser, placeOrderCOD);
// Online payment: /api/order/online
orderRouter.post("/online", authUser, placeOrderOnline);
// Get Orders by User ID: /api/order/user
orderRouter.get("/user", authUser, getOrdersByUserId);
// Get all orders (for seller / admin): /api/order/seller
orderRouter.get("/seller", authSeller, getAllOrders);
// Update Order Status: /api/order/status
orderRouter.post("/status", authSeller, updateOrderStatus);

export default orderRouter;

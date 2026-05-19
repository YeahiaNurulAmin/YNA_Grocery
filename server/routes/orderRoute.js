import express from "express";
import authUser from "../middlewares/authUser.js";
import { getAllOrders, getOrdersByUserId, placeOrderCOD, placeOrderOnline } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place Order COD: /api/order/cod
orderRouter.post("/cod", authUser, placeOrderCOD);
// Online payment: /api/order/online
orderRouter.post("/online", authUser, placeOrderOnline);
// Get Orders by User ID: /api/order/user
orderRouter.get("/user", authUser, getOrdersByUserId);
// Get all orders (for seller / admin): /api/order/seller
orderRouter.get("/seller", authUser, getAllOrders);

export default orderRouter;

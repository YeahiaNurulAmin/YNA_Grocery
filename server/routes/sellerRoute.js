import express from "express";
import { sellerLogout, sellerLogin, isSellerAuth } from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";


const sellerRouter = express.Router();

// /api/seller/login
sellerRouter.post("/login", sellerLogin);
// /api/seller/is-auth
sellerRouter.get("/is-auth", authSeller, isSellerAuth);
// /api/seller/logout
sellerRouter.get("/logout", authSeller, sellerLogout);

export default sellerRouter;
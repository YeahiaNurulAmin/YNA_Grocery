import express from "express";
import authUser from "../middlewares/authUser.js";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../controllers/addressController.js";


const addressRouter = express.Router();

// Add Address: /api/address/add
addressRouter.post("/add", authUser, addAddress);
// Get Address: /api/address/get
addressRouter.get("/get", authUser, getAddress);
// Update Address: /api/address/update
addressRouter.post("/update", authUser, updateAddress);
// Delete Address: /api/address/delete
addressRouter.delete("/delete", authUser, deleteAddress);


export default addressRouter;
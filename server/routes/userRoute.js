import express from "express";
import { register, login, isAuth, logout, updateProfile, changePassword } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { upload } from "../configs/multer.js";

const userRouter = express.Router();
// Register User: /api/users/register
userRouter.post("/register", register);
// Login User: /api/users/login
userRouter.post("/login", login);
// Check Auth: /api/users/is-auth
userRouter.get("/is-auth", authUser, isAuth);
// Logout User: /api/users/logout
userRouter.get("/logout", authUser, logout);
// Update User Profile: /api/users/profile
userRouter.put("/profile", authUser, upload.single("image"), updateProfile);
// Change Password: /api/users/change-password
userRouter.put("/change-password", authUser, changePassword);

export default userRouter;
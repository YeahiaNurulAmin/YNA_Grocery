import express from "express";
import { register, login, isAuth, logout } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();
// Register User: /api/users/register
userRouter.post("/register", register);
// Login User: /api/users/login
userRouter.post("/login", login);
// Check Auth: /api/users/is-auth
userRouter.get("/is-auth", authUser, isAuth);
// Logout User: /api/users/logout
userRouter.get("/logout", authUser, logout);




export default userRouter;
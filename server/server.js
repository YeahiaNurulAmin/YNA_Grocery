import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";
import dns from "dns";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import addressRoute from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import couponRouter from "./routes/couponRoute.js";
import { verifyPayment } from "./controllers/orderController.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Configurations
// Connect to DB
await connectDB();
// Connect to Cloudinary
await connectCloudinary();

// Variables
const port = process.env.PORT || 4000;

// Allow multiple origins from a comma-separated environment variable
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middlewares - Apply CORS first
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight requests explicitly
app.options("{*path}", cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Stripe webhook - MUST be before express.json() and use raw body
app.post("/verify-payment", express.raw({ type: "application/json" }), verifyPayment);

app.use(express.json());
app.use(cookieParser());





// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});
// User Routes
app.use("/api/users", userRouter);
// Seller Routes
app.use("/api/seller", sellerRouter);
// Product Routes
app.use("/api/products", productRouter);
// Cart Routes
app.use("/api/cart", cartRoute);  
// Address Routes
app.use("/api/address", addressRoute);  
// Order Routes
app.use("/api/order", orderRouter);
// Coupon Routes
app.use("/api/coupons", couponRouter);

// Trigger restart 5 - restore srv URI
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
});


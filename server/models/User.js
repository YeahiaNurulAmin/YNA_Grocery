import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, default: ""},
    avatar: {type: String, default: ""},
    cartItems: {type: Object, default: {}, minimize: false},
}, {minimize: false, timestamps: true});

// Check if the model already exists to avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
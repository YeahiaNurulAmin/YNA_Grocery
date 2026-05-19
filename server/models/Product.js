import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: false,
    },
    rating: {
        type: Number,
        required: false,
    },
    images: {
        type: [String],
        required: false,
    },
    description: {
        type: [String],
        required: true,
    },
    inStock: {
        type: Boolean,
        required: false,
        default: true,
    },
    quantity: {
        type: Number,
        required: false,
        
    },
}, {timestamps: true});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
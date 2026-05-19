import cloudinary from "cloudinary";
import Product from "../models/Product.js";

// Add Product : /api/products/add
export const addProduct = async (req, res) => {
    try {
        if (!req.body.productDate) {
            return res.status(400).json({success: false, message: "Product data is required" });
        }

        let productDate = JSON.parse(req.body.productDate);
        const images = req.files;

        console.log("images:", images);

        if (!images || images.length === 0) {
            return res.status(400).json({success: false, message: "At least one image is required" });
        }

        let imageUrls = await Promise.all(
            images.map(async (file) => {
                let result = await cloudinary.uploader.upload(file.path, {
                    result_type: "image",
                });
                return result.secure_url;
            }),
        );

        console.log("imageUrls:", imageUrls);

        await Product.create({
            ...productDate,
            images: imageUrls,
        });

        res.status(201).json({success: true, message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Error adding product", error });
    }
};
// Get Product : /api/products/list
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        res.status(200).json({
            success: true, message: "Products fetched successfully",
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Error fetching products", error });
    }
};
// Get Single Product : /api/products/id
export const getProductById = async (req, res) => {    
    try {
        const { id } = req.query;
        console.log("Fetching product with ID:", id);
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({
            success: true, message: "Product fetched successfully",
            product,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: "Error fetching product", error });
    }
};
// Change Product in Stock : /api/products/stock
export const changeProductInStock = async (req, res) => {
    const { id, inStock } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndUpdate(id, { inStock });
        res.status(200).json({
            success: true,
            message: "Product stock status changed successfully",
        });
    } catch (error) {
        console.error("Error changing product stock status:", error);
        res.status(500).json({
            success: false,
            message: "Error changing product stock status",
            error,
        });
    }
};

// Update Product : /api/products/update
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let productDate = JSON.parse(req.body.productDate);

        const images = req.files;

        let imageUrls = product.images; // Keep existing images by default

        // Only upload new images if provided
        if (images && images.length > 0) {
            imageUrls = await Promise.all(
                images.map(async (file) => {
                    let result = await cloudinary.uploader.upload(file.path, {
                        result_type: "image",
                    });
                    return result.secure_url;
                }),
            );
        }

        await Product.findByIdAndUpdate(id, {
            ...productDate,
            images: imageUrls,
        });

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product", error });
    }
};

// Delete Product : /api/products/delete
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error });
    }
};
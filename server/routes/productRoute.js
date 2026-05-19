import express from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct, changeProductInStock } from "../controllers/productController.js";
import authSeller from "../middlewares/authSeller.js";
import { upload } from "../configs/multer.js";

const productRouter = express.Router();

// Add Product : /api/products/add
productRouter.post("/add", authSeller, upload.array("images"), addProduct);

// Get All Products : /api/products/list
productRouter.get("/list", getAllProducts);

// Get Single Product : /api/products/id
productRouter.get("/id", getProductById);

// Update Product : /api/products/update
productRouter.put("/update", authSeller, upload.array("images"), updateProduct);

// Delete Product : /api/products/delete
productRouter.delete("/delete", authSeller, deleteProduct);

// Change Product in Stock : /api/products/stock
productRouter.put("/stock", authSeller, changeProductInStock);

export default productRouter;
import express from "express";
const productRoutes = express.Router();

import {
    createProduct,
    deleteProduct,
    getProductDetails,
    getProducts,
    getUserProducts,
    searchProducts,
    updateProductDetails,
} from "../controllers/productsController";
import { authToken } from "../security/authentication";

productRoutes.get("/", getProducts);
productRoutes.get("/product/:_id", getProductDetails);
productRoutes.post("/add-product", authToken, createProduct);
productRoutes.post("/my-products", authToken, getUserProducts);
productRoutes.post("/search-products", searchProducts);
productRoutes.patch("/update-my-product", authToken, updateProductDetails);
productRoutes.post("/:prod_id/delete", authToken, deleteProduct);

export default productRoutes;

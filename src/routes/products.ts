import express from "express";
const productRoutes = express.Router();

import {
    createProduct,
    getProductDetails,
    getProducts,
    searchProducts,
} from "../controllers/productsController";
import { authToken } from "../security/authentication";

productRoutes.get("/", getProducts);
productRoutes.get("/product/:_id", getProductDetails);
productRoutes.post("/add-product", authToken, createProduct);
productRoutes.post("/search-products", searchProducts);

export default productRoutes;

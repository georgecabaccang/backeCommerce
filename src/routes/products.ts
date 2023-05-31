import express from "express";
const productRoutes = express.Router();

import {
    addProducts,
    getProductDetails,
    getProducts,
    searchProducts,
} from "../controllers/productsController";

productRoutes.get("/", getProducts);
productRoutes.get("/product/:_id", getProductDetails);
productRoutes.post("/add-product", addProducts);
productRoutes.get("/search-products", searchProducts);

export default productRoutes;

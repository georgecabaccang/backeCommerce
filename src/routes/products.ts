import express from "express";
const productRoutes = express.Router();

import {
    addProducts,
    createCart,
    getProductDetails,
    getProducts,
} from "../controllers/productsController";

productRoutes.get("/", getProducts);
productRoutes.get("/product/:_id", getProductDetails);
productRoutes.post("/add-product", addProducts);

export default productRoutes;

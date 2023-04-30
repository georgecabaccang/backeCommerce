import express from "express";
import { addProducts, getProducts } from "../controllers/productsController";
const productRoutes = express.Router();

productRoutes.get("/", getProducts);
productRoutes.post("/add-product", addProducts);

export default productRoutes;

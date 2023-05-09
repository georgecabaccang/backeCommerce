import express from "express";
import { getUserCart } from "../controllers/cartControllers";
import { authToken } from "../security/authentication";
import { addToCart } from "../controllers/cartControllers";

const cartsRoutes = express.Router();

cartsRoutes.get("/", authToken, getUserCart);
cartsRoutes.post("/add-to-cart", authToken, addToCart);

export default cartsRoutes;

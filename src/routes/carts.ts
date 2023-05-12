import express from "express";
import { changeQuantity, getUserCart } from "../controllers/cartControllers";
import { authToken } from "../security/authentication";
import { addToCart } from "../controllers/cartControllers";

const cartsRoutes = express.Router();

cartsRoutes.post("/", authToken, getUserCart);
cartsRoutes.post("/add-to-cart", authToken, addToCart);
cartsRoutes.put("/change-quantity", authToken, changeQuantity);

export default cartsRoutes;

import express from "express";
import { authToken } from "../security/authentication";

import {
    changeQuantity,
    getUserCart,
    addToCart,
    removeFromCart,
} from "../controllers/cartControllers";

const cartsRoutes = express.Router();

cartsRoutes.post("/", authToken, getUserCart);
cartsRoutes.post("/add-to-cart", authToken, addToCart);
cartsRoutes.delete("/remove-from-cart", authToken, removeFromCart);
cartsRoutes.put("/change-quantity", authToken, changeQuantity);

export default cartsRoutes;

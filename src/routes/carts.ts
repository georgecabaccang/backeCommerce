import express from "express";
import { authToken } from "../security/authentication";

import {
    addToCheckOut,
    changeQuantity,
    getToCheckOutItems,
    getUserCart,
    addToCart,
    removeFromCart,
} from "../controllers/cartControllers";

const cartsRoutes = express.Router();

cartsRoutes.post("/", authToken, getUserCart);
cartsRoutes.post("/add-to-cart", authToken, addToCart);
cartsRoutes.delete("/remove-from-cart", authToken, removeFromCart);
cartsRoutes.put("/change-quantity", authToken, changeQuantity);
cartsRoutes.post("/addToCheckOut", authToken, addToCheckOut);
cartsRoutes.post("/getToCheckOutItems", authToken, getToCheckOutItems);

export default cartsRoutes;

import express from "express";
import { authToken } from "../security/authentication";
import { addToCart } from "../controllers/cartControllers";

import {
    addToCheckOut,
    changeQuantity,
    getToCheckOutItems,
    getUserCart,
} from "../controllers/cartControllers";

const cartsRoutes = express.Router();

cartsRoutes.post("/", authToken, getUserCart);
cartsRoutes.post("/add-to-cart", authToken, addToCart);
cartsRoutes.put("/change-quantity", authToken, changeQuantity);
cartsRoutes.post("/addToCheckOut", authToken, addToCheckOut);
cartsRoutes.post("/getToCheckOutItems", authToken, getToCheckOutItems);

export default cartsRoutes;

import express from "express";
import { authToken } from "../security/authentication";
import {
    cancelOrder,
    getOrders,
    placeOrder,
    removeCheckOutDocument,
} from "../controllers/ordersController";

const ordersRoutes = express.Router();

ordersRoutes.post("/", authToken, getOrders);
ordersRoutes.post("/order-checkout", authToken, placeOrder, removeCheckOutDocument);
ordersRoutes.post("/cancel-order", authToken, cancelOrder);

export default ordersRoutes;

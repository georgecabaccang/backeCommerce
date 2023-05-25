import express from "express";
import { authToken } from "../security/authentication";
import {
    cancelOrder,
    getOrders,
    placeOrder,
    updateOrderStatusToReceived,
} from "../controllers/ordersController";

const ordersRoutes = express.Router();

ordersRoutes.post("/", authToken, getOrders);
ordersRoutes.post("/order-checkout", authToken, placeOrder);
ordersRoutes.post("/cancel-order", authToken, cancelOrder);
ordersRoutes.post("/order-status-received", authToken, updateOrderStatusToReceived);

export default ordersRoutes;

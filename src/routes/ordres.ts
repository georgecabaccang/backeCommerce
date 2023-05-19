import express from "express";
import { authToken } from "../security/authentication";
import { getOrders, placeOrder } from "../controllers/ordersController";

const ordersRoutes = express.Router();

ordersRoutes.post("/", authToken, getOrders);
ordersRoutes.post("/order-checkout", authToken, placeOrder);

export default ordersRoutes;

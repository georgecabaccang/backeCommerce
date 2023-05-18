import express from "express";
import { authToken } from "../security/authentication";
import { placeOrder } from "../controllers/ordersController";

const ordersRoutes = express.Router();

ordersRoutes.post("/order-checkout", authToken, placeOrder);

export default ordersRoutes;

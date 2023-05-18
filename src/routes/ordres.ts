import express from "express";
import { authToken } from "../security/authentication";

const ordersRoutes = express.Router();

ordersRoutes.post("/order-checkout", authToken);

export default ordersRoutes;

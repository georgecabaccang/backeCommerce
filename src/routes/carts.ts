import express from "express";
import { getUserCart } from "../controllers/cartControllers";
import { authToken } from "../security/authentication";

const cartsRoutes = express.Router();

cartsRoutes.get("/", authToken, getUserCart);

export default cartsRoutes;

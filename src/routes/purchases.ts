import express from "express";
import { authToken } from "../security/authentication";

const purchaseRoutes = express.Router();

purchaseRoutes.post("/", authToken);

export default purchaseRoutes;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/products";
import { IDBTypes } from "./types/DBTypes";
import userRoutes from "./routes/users";
import cartsRoutes from "./routes/carts";
import ordersRoutes from "./routes/orders";

import ServerlessHttp from "serverless-http";

const app = express();
mongoose.connect(
    "mongodb+srv://miniprojects:thenewpassword@projects.wpbsykb.mongodb.net/eCommerce?retryWrites=true&w=majority"
);

const db = mongoose.connection;
db.on("error", (error: IDBTypes) => {
    console.log(error.message);
});
db.once("open", () => {
    console.log("Connected to DB");
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

app.use("/.netlify/source/api/user", userRoutes);
app.use("/.netlify/source/api/shop", productRoutes);
app.use("/.netlify/source/api/cart", cartsRoutes);
app.use("/.netlify/source/api/orders", ordersRoutes);

app.listen(8002, () => {
    console.log("Port 8002");
});

module.exports.handler = ServerlessHttp(app);

import express, { Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/products";
import { IDBTypes } from "./types/DBTypes";
import userRoutes from "./routes/users";
import cartsRoutes from "./routes/carts";
import ordersRoutes from "./routes/orders";

import serverless from "serverless-http";
import bodyParser from "body-parser";

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
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

// const route = Router();
// route.get("/hello", (req, res) => res.send("Hello World!"));
// app.use("/server", route);

app.use("/user", userRoutes);
app.use("/shop", productRoutes);
app.use("/cart", cartsRoutes);
app.use("/orders", ordersRoutes);

app.listen(8002, () => {
    console.log("Port 8002");
});

module.exports.handler = serverless(app);

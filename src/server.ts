require("dotenv").config();

import express, { Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/products";
import { IDBTypes } from "./types/DBTypes";
import userRoutes from "./routes/users";
import cartsRoutes from "./routes/carts";
import ordersRoutes from "./routes/orders";

// import serverless from "serverless-http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
mongoose.connect(process.env.MONGO_DB as string);

const db = mongoose.connection;
db.on("error", (error: IDBTypes) => {
    console.log(error.message);
});
db.once("open", () => {
    console.log("Connected to DB");
});
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ credentials: true, origin: "https://fronte-commerce.vercel.app" }));

app.use("/user", userRoutes);
app.use("/shop", productRoutes);
app.use("/cart", cartsRoutes);
app.use("/orders", ordersRoutes);

app.listen(8002, () => {
    console.log("Port 8002");
});

export default app;

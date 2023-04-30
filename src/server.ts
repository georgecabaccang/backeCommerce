import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/products";
import { IDBTypes } from "./types/DBTypes";

const app = express();

mongoose.connect(
    "mongodb+srv://miniprojects:thenewpassword@projects.wpbsykb.mongodb.net/movies?retryWrites=true&w=majority"
);

const db = mongoose.connection;
db.on("error", (error: IDBTypes) => {
    console.log(error.message);
});
db.once("open", () => {
    console.log("Connected to DB");
});

app.use(cors());

app.use("/shop", productRoutes);

app.listen(8002, () => {
    console.log("Port 8002");
});

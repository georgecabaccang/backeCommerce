"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const products_1 = __importDefault(require("./routes/products"));
const users_1 = __importDefault(require("./routes/users"));
const carts_1 = __importDefault(require("./routes/carts"));
const orders_1 = __importDefault(require("./routes/orders"));
// import serverless from "serverless-http";
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
mongoose_1.default.connect(process.env.MONGO_DB);
const db = mongoose_1.default.connection;
db.on("error", (error) => {
    console.log(error.message);
});
db.once("open", () => {
    console.log("Connected to DB");
});
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
app.use((0, cors_1.default)({ credentials: true, origin: "https://fronte-commerce.vercel.app" }));
app.use("/user", users_1.default);
app.use("/shop", products_1.default);
app.use("/cart", carts_1.default);
app.use("/orders", orders_1.default);
app.listen(8002, () => {
    console.log("Port 8002");
});
exports.default = app;

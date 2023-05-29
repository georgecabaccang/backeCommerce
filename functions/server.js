"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const products_1 = __importDefault(require("./routes/products"));
const users_1 = __importDefault(require("./routes/users"));
const carts_1 = __importDefault(require("./routes/carts"));
const orders_1 = __importDefault(require("./routes/orders"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
mongoose_1.default.connect("mongodb+srv://miniprojects:thenewpassword@projects.wpbsykb.mongodb.net/eCommerce?retryWrites=true&w=majority");
const db = mongoose_1.default.connection;
db.on("error", (error) => {
    console.log(error.message);
});
db.once("open", () => {
    console.log("Connected to DB");
});
app.use(body_parser_1.default.json());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb" }));
app.use((0, cors_1.default)());
app.use("/.netlify/functions/routes/users", users_1.default);
app.use("/.netlify/functions/routes/shops", products_1.default);
app.use("/.netlify/functions/routes/carts", carts_1.default);
app.use("/.netlify/functions/routes/orders", orders_1.default);
app.listen(8002, () => {
    console.log("Port 8002");
});
module.exports.handler = (0, serverless_http_1.default)(app);
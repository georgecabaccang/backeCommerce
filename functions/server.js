"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
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
const route = (0, express_1.Router)();
route.get("/hello", (req, res) => res.send("Hello World!"));
app.use("/server/", route);
app.use("/user", users_1.default);
app.use("/shop", products_1.default);
app.use("/cart", carts_1.default);
app.use("/orders", orders_1.default);
app.listen(8002, () => {
    console.log("Port 8002");
});
module.exports.handler = (0, serverless_http_1.default)(app);

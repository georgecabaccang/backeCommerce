"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const products_1 = __importDefault(require("./routes/products"));
const app = (0, express_1.default)();
mongoose_1.default.connect("mongodb+srv://miniprojects:thenewpassword@projects.wpbsykb.mongodb.net/movies?retryWrites=true&w=majority");
const db = mongoose_1.default.connection;
db.on("error", (error) => {
    console.log(error.message);
});
db.once("open", () => {
    console.log("Connected to DB");
});
app.use((0, cors_1.default)());
app.use("/shop", products_1.default);
app.listen(8002, () => {
    console.log("Port 8002");
});

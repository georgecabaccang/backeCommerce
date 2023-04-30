"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("../controllers/productsController");
const productRoutes = express_1.default.Router();
productRoutes.get("/", productsController_1.getProducts);
productRoutes.post("/add-product", productsController_1.addProducts);
exports.default = productRoutes;

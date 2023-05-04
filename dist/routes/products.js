"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes = express_1.default.Router();
const productsController_1 = require("../controllers/productsController");
const authentication_1 = require("../security/authentication");
productRoutes.get("/", productsController_1.getProducts);
productRoutes.get("/product/:_id", authentication_1.authToken, productsController_1.getProductDetails);
productRoutes.post("/add-product", productsController_1.addProducts);
// FOR CREATING TEMP CART
productRoutes.post("/cart", productsController_1.createCart);
exports.default = productRoutes;

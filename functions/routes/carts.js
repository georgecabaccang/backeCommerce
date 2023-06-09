"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../security/authentication");
const cartControllers_1 = require("../controllers/cartControllers");
const cartsRoutes = express_1.default.Router();
cartsRoutes.post("/", authentication_1.authToken, cartControllers_1.getUserCart);
cartsRoutes.post("/item/get-details", authentication_1.authToken, cartControllers_1.getItemDetails);
cartsRoutes.post("/add-to-cart", authentication_1.authToken, cartControllers_1.addToCart);
cartsRoutes.post("/remove-from-cart", authentication_1.authToken, cartControllers_1.removeFromCart);
cartsRoutes.put("/change-quantity", authentication_1.authToken, cartControllers_1.changeQuantity);
exports.default = cartsRoutes;

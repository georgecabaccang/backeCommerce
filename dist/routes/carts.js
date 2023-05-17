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
cartsRoutes.post("/add-to-cart", authentication_1.authToken, cartControllers_1.addToCart);
cartsRoutes.delete("/remove-from-cart", authentication_1.authToken, cartControllers_1.removeFromCart);
cartsRoutes.put("/change-quantity", authentication_1.authToken, cartControllers_1.changeQuantity);
cartsRoutes.post("/add-to-checkout", authentication_1.authToken, cartControllers_1.addToCheckOut);
cartsRoutes.post("/remove-from-checkout", authentication_1.authToken, cartControllers_1.removeFromCheckOut);
cartsRoutes.post("/get-to-checkout-items", authentication_1.authToken, cartControllers_1.getToCheckOutItems);
exports.default = cartsRoutes;

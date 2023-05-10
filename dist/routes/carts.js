"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartControllers_1 = require("../controllers/cartControllers");
const authentication_1 = require("../security/authentication");
const cartControllers_2 = require("../controllers/cartControllers");
const cartsRoutes = express_1.default.Router();
cartsRoutes.get("/", authentication_1.authToken, cartControllers_1.getUserCart);
cartsRoutes.post("/add-to-cart", authentication_1.authToken, cartControllers_2.addToCart);
exports.default = cartsRoutes;

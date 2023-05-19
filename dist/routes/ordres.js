"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../security/authentication");
const ordersController_1 = require("../controllers/ordersController");
const ordersRoutes = express_1.default.Router();
ordersRoutes.post("/", authentication_1.authToken, ordersController_1.getOrders);
ordersRoutes.post("/order-checkout", authentication_1.authToken, ordersController_1.placeOrder);
exports.default = ordersRoutes;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const userRoutes = express_1.default.Router();
userRoutes.get("/all-users");
userRoutes.post("/register", userControllers_1.createUser);
userRoutes.post("/login", userControllers_1.login);
exports.default = userRoutes;
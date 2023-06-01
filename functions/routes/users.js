"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
// import { authToken } from "../security/authentication";
const userRoutes = express_1.default.Router();
userRoutes.get("/all-users");
// userRoutes.get("/profile/:user_id", authToken, getUserProfile);
userRoutes.post("/register", userControllers_1.createUser);
userRoutes.post("/login", userControllers_1.login);
userRoutes.post("/refreshlogin", userControllers_1.refreshLogin);
userRoutes.post("/logout", userControllers_1.logout);
exports.default = userRoutes;

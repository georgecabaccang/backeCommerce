"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token = (user) => {
    if (process.env.ACCESS_TOKEN) {
        const accessToken = jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN);
        return accessToken;
    }
};
exports.token = token;

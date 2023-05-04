"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = exports.token = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const token = (user) => {
    if (ACCESS_TOKEN) {
        const accessToken = jsonwebtoken_1.default.sign(user, ACCESS_TOKEN);
        return accessToken;
    }
};
exports.token = token;
const authToken = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header && header.split(" ")[1];
    if (!token)
        return res.send("no token provided");
    if (ACCESS_TOKEN) {
        const verified = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN);
        res.send(verified);
    }
};
exports.authToken = authToken;

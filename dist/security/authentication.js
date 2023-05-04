"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = exports.token = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const token = (user) => {
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
        const accessToken = jsonwebtoken_1.default.sign(user, ACCESS_TOKEN, { expiresIn: "30s" });
        const refreshToken = jsonwebtoken_1.default.sign(user, REFRESH_TOKEN);
        const tokens = {
            accessToken,
            refreshToken,
        };
        return tokens;
    }
};
exports.token = token;
const authToken = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header && header.split(" ")[1];
    if (!token)
        return res.send("no token provided");
    if (ACCESS_TOKEN) {
        const userDetails = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN);
        req.authenticatedUser = userDetails;
        next();
    }
};
exports.authToken = authToken;
// headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
// },

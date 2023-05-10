"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = exports.refreshTokenFn = exports.token = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const token = (user) => {
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
        const accessToken = jsonwebtoken_1.default.sign(user, ACCESS_TOKEN, { expiresIn: "10m" }); // change expiresIn accordingly if testing
        const refreshToken = jsonwebtoken_1.default.sign({ email: user.email, _id: user._id }, REFRESH_TOKEN, {
            expiresIn: "15m",
        });
        const tokens = {
            accessToken,
            refreshToken,
        };
        return tokens;
    }
    else {
        const tokens = {
            accessToken: "no secret code given for token creation",
            refreshToken: "no secret code given for token creation",
        };
        return tokens;
    }
};
exports.token = token;
const refreshTokenFn = (refreshToken, userEmail) => {
    if (REFRESH_TOKEN) {
        const userDetails = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN);
        if (userDetails.email != userEmail)
            return "refresh token does not belong to current user";
        return (0, exports.token)({ email: userDetails.email, _id: userDetails._id });
    }
};
exports.refreshTokenFn = refreshTokenFn;
const authToken = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        const token = header && header.split(" ")[1];
        if (!token)
            return res.send("no token provided");
        if (ACCESS_TOKEN) {
            const userDetails = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN);
            req.authenticatedUser = { email: userDetails.email, _id: userDetails._id };
            next();
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
};
exports.authToken = authToken;

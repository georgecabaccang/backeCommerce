"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPasswordToken = exports.resetPasswordToken = exports.authToken = exports.refreshTokenFn = exports.token = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FORGOT_PASSWORD_HASHER = process.env.FORGOT_PASSWORD_HASHER;
const ACCESSTOKEN_EXPIRE_TIME = "30m";
const REFRESHTOKEN_EXPIRE_TIME = "1h";
const token = (user) => {
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
        const accessToken = jsonwebtoken_1.default.sign(user, ACCESS_TOKEN, { expiresIn: ACCESSTOKEN_EXPIRE_TIME });
        const refreshToken = jsonwebtoken_1.default.sign(user, REFRESH_TOKEN, {
            expiresIn: REFRESHTOKEN_EXPIRE_TIME,
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
        // Check if use matches provided token
        if (userDetails.email != userEmail)
            return "refresh token does not belong to current user";
        const newTokens = (0, exports.token)({
            email: userDetails.email,
            _id: userDetails._id,
            isSeller: userDetails.isSeller,
        });
        if (newTokens.accessToken === "no secret code given for token creation") {
            return "failed to generate new tokens";
        }
        return newTokens;
    }
};
exports.refreshTokenFn = refreshTokenFn;
const authToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const token = req.cookies.accessToken;
        if (!token)
            return res.send("no token provided");
        if (ACCESS_TOKEN) {
            const userDetails = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN);
            // Check if use matches provided token
            if (email != userDetails.email)
                return res.send("Payload User Mismatch");
            const user = yield userModel_1.default.findById(userDetails._id);
            if (user) {
                req.authenticatedUser = {
                    email: user.email,
                    _id: user._id.toString(),
                    isSeller: user.isSeller,
                };
            }
            next();
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.authToken = authToken;
const resetPasswordToken = (completedString, idLength) => __awaiter(void 0, void 0, void 0, function* () {
    console.log();
    if (FORGOT_PASSWORD_HASHER) {
        const token = jsonwebtoken_1.default.sign({ completedString: completedString, idLength: idLength }, FORGOT_PASSWORD_HASHER, {
            expiresIn: "5m",
        });
        return token;
    }
});
exports.resetPasswordToken = resetPasswordToken;
const verifyPasswordToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (FORGOT_PASSWORD_HASHER) {
        const payload = jsonwebtoken_1.default.verify(token, FORGOT_PASSWORD_HASHER);
        return payload;
    }
});
exports.verifyPasswordToken = verifyPasswordToken;

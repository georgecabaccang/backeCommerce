require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserModelForTokensAndPayload } from "../types/UserModel";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const ACCESSTOKEN_EXPIRE_TIME = "30m";
const REFRESHTOKEN_EXPIRE_TIME = "1h";

export const token = (user: IUserModelForTokensAndPayload) => {
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
        const accessToken = jwt.sign(user, ACCESS_TOKEN, { expiresIn: ACCESSTOKEN_EXPIRE_TIME });
        const refreshToken = jwt.sign(user, REFRESH_TOKEN, {
            expiresIn: REFRESHTOKEN_EXPIRE_TIME,
        });
        const tokens = {
            accessToken,
            refreshToken,
        };
        return tokens;
    } else {
        const tokens = {
            accessToken: "no secret code given for token creation",
            refreshToken: "no secret code given for token creation",
        };
        return tokens;
    }
};

export const refreshTokenFn = (refreshToken: string, userEmail: string) => {
    if (REFRESH_TOKEN) {
        const userDetails = jwt.verify(refreshToken, REFRESH_TOKEN) as JwtPayload;

        // Check if use matches provided token
        if (userDetails.email != userEmail) return "refresh token does not belong to current user";

        const newTokens = token({
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

export const authToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const token = req.cookies.accessToken;

        if (!token) return res.send("no token provided");

        if (ACCESS_TOKEN) {
            const userDetails = jwt.verify(token, ACCESS_TOKEN) as JwtPayload;

            // Check if use matches provided token
            if (email != userDetails.email) return res.send("Payload User Mismatch");
            const user = await User.findById(userDetails._id);
            if (user) {
                req.authenticatedUser = {
                    email: user.email,
                    _id: user._id.toString(),
                    isSeller: user.isSeller,
                };
            }

            next();
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

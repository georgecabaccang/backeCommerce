require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserModelForTokensAndPayload } from "../types/UserModel";
import { Request, Response, NextFunction } from "express";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const token = (user: IUserModelForTokensAndPayload) => {
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
        const accessToken = jwt.sign(user, ACCESS_TOKEN, { expiresIn: "10m" }); // change expiresIn accordingly if testing
        const refreshToken = jwt.sign({ email: user.email, _id: user._id }, REFRESH_TOKEN, {
            expiresIn: "15m",
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
        return token({ email: userDetails.email, _id: userDetails._id });
    }
};

export const authToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        const email = req.body.email;
        const token = header && header.split(" ")[1];

        if (!token) return res.send("no token provided");

        if (ACCESS_TOKEN) {
            const userDetails = jwt.verify(token, ACCESS_TOKEN) as JwtPayload;

            // Check if use matches provided token
            if (email != userDetails.email) return res.send("Payload User Mismatch");

            req.authenticatedUser = { email: userDetails.email, _id: userDetails._id };
            next();
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

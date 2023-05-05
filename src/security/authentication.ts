require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserModelForTokensAndPayload } from "../types/UserModel";
import { Request, Response, NextFunction } from "express";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const token = (user: IUserModelForTokensAndPayload) => {
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
        const accessToken = jwt.sign(user, ACCESS_TOKEN, { expiresIn: "5m" }); // change this accordingly if testing
        const refreshToken = jwt.sign(user, REFRESH_TOKEN);
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

export const refreshToken = (refreshToken: string) => {
    if (REFRESH_TOKEN) {
        const userDetails = jwt.verify(refreshToken, REFRESH_TOKEN) as JwtPayload;
        //  Think about stuff here
        //
        //
        //
        return token(userDetails);
    }
};

export const authToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        const token = header && header.split(" ")[1];
        if (!token) return res.send("no token provided");

        if (ACCESS_TOKEN) {
            const userDetails = jwt.verify(token, ACCESS_TOKEN);
            req.authenticatedUser = userDetails;
            next();
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

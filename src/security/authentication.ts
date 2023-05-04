require("dotenv").config();
import jwt from "jsonwebtoken";
import { IUserModel } from "../types/UserModel";
import { Request, Response, NextFunction } from "express";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const token = (user: IUserModel) => {
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
        const accessToken = jwt.sign(user, ACCESS_TOKEN, { expiresIn: "30s" });
        const refreshToken = jwt.sign(user, REFRESH_TOKEN);
        const tokens = {
            accessToken,
            refreshToken,
        };
        return tokens;
    }
};

export const authToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header && header.split(" ")[1];
    if (!token) return res.send("no token provided");

    if (ACCESS_TOKEN) {
        const userDetails = jwt.verify(token, ACCESS_TOKEN);
        req.authenticatedUser = userDetails;
        next();
    }
};

// headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
// },

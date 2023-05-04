require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserModel } from "../types/UserModel";
import { Request, Response, NextFunction } from "express";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export const token = (user: IUserModel) => {
    if (ACCESS_TOKEN) {
        const accessToken = jwt.sign(user, ACCESS_TOKEN);
        return accessToken;
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

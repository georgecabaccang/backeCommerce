require("dotenv").config();
import jwt from "jsonwebtoken";
import { IUserModel } from "../types/UserModel";

export const token = (user: IUserModel) => {
    if (process.env.ACCESS_TOKEN) {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
        return accessToken;
    }
};

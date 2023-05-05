import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface IUserModel {
    email: string;
    password: string;
    userCart?: Types.ObjectId | null;
}

export interface IUserModelForTokensAndPayload extends JwtPayload {
    _id?: Types.ObjectId;
    email?: string;
    password?: string;
}

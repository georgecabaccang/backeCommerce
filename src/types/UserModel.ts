import { Types } from "mongoose";

export interface IUserModel {
    email: string;
    password: string;
    userCart: Types.ObjectId | null;
}

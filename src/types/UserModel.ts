import { Types } from "mongoose";

export interface IUserModel {
    username: string;
    password: string;
    userCart: Types.ObjectId | null;
}

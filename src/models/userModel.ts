import { Model, Schema, model } from "mongoose";
import { IUserModel } from "../types/UserModel";

const userSchema = new Schema<IUserModel, Model<IUserModel>>(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        userCart: { type: Schema.Types.ObjectId, ref: "Cart" },
    },
    { timestamps: true }
);

const User = model<IUserModel>("User", userSchema);
export default User;

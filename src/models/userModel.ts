import { Model, Schema, model, Types } from "mongoose";
import { IUserModel } from "../types/UserModel";

const userSchema = new Schema<IUserModel, Model<IUserModel>>(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        userCart: { type: Types.ObjectId, ref: "Cart" },
        userOrders: { type: Types.ObjectId, ref: "Order" },
        userPurchases: { type: Types.ObjectId, ref: "Purchase" },
    },
    { timestamps: true }
);

const User = model<IUserModel>("User", userSchema);
export default User;

import { Model, Schema, model } from "mongoose";
import { IUserModel } from "../types/UserModel";

const userSchema = new Schema<IUserModel, Model<IUserModel>>(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        userCart: { type: Schema.Types.ObjectId, ref: "Cart" },
        userOrders: { type: Schema.Types.ObjectId, ref: "Order" },
        // userPurchases: { type: Types.ObjectId, ref: "Purchase" },
    },
    { timestamps: true }
);

const User = model<IUserModel>("User", userSchema);
export default User;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userCart: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cart" },
    userOrders: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order" },
    // userPurchases: { type: Types.ObjectId, ref: "Purchase" },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;

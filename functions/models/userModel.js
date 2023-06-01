"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    userCart: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cart" },
    userOrders: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order" },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;

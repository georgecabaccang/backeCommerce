"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const resetPasswordTokenSchema = new mongoose_1.Schema({
    resetToken: { type: String, required: true },
    expireAt: {
        type: Date,
        expires: 300,
        default: Date.now,
    },
});
const ResetPasswordToken = (0, mongoose_1.model)("ResetPasswordToken", resetPasswordTokenSchema);
exports.default = ResetPasswordToken;

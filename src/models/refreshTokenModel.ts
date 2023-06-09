import { Schema, model } from "mongoose";
import { IRefreshToken } from "../types/jwt";

const refreshTokenSchema = new Schema<IRefreshToken>({
    refreshToken: { type: String, required: true },
    expireAt: {
        type: Date,
        expires: 3600,
        default: Date.now,
    },
});

const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
export default RefreshToken;

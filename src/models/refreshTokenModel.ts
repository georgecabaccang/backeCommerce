import { Schema, model } from "mongoose";
import { IRefreshToken } from "../types/jwt";

const refreshTokenSchema = new Schema<IRefreshToken>({
    refreshToken: { type: String, required: true },
});

const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
export default RefreshToken;

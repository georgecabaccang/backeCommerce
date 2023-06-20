import { Schema, model } from "mongoose";

interface IForgotPassword {
    resetToken: string;
    expireAt: Date;
}

const resetPasswordTokenSchema = new Schema<IForgotPassword>({
    resetToken: { type: String, required: true },
    expireAt: {
        type: Date,
        expires: 300,
        default: Date.now,
    },
});

const ResetPasswordToken = model<IForgotPassword>("ResetPasswordToken", resetPasswordTokenSchema);
export default ResetPasswordToken;

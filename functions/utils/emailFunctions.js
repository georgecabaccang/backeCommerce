"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetLink = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const MY_EMAIL = "georgesycabaccang@gmail.com";
const sendResetLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resetToken = req.resetToken;
    const toSendToEmail = req.authenticatedUser.email;
    const user_id = req.authenticatedUser._id;
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: MY_EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });
    const options = {
        from: MY_EMAIL,
        to: toSendToEmail,
        subject: "Reset Password Link",
        html: `<p>Here's the reset password <a href="https://fronte-commerce.vercel.app/reset-password/${user_id}/${resetToken}">Link</a>. This will expire in 5 minutes.</p>`,
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            return res.sendStatus(403);
        }
        return res
            .status(200)
            .send(`https://fronte-commerce.vercel.app/reset-password/${user_id}/${resetToken}`);
    });
});
exports.sendResetLink = sendResetLink;

import { Request, Response } from "express";
import nodemailer from "nodemailer";

const MY_EMAIL = "georgesycabaccang@gmail.com";

export const sendResetLink = async (req: Request, res: Response) => {
    const resetToken = req.resetToken;
    const toSendToEmail = req.authenticatedUser.email;
    const user_id = req.authenticatedUser._id;

    const transporter = nodemailer.createTransport({
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
};

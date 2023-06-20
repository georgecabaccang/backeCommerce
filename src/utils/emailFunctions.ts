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
            // make env for pass
            pass: "khifokwnpdcfbzcw",
        },
    });

    const options = {
        from: MY_EMAIL,
        to: toSendToEmail,
        subject: "Test Token",
        html: `http://localhost:5173/reset-password/${user_id}/${resetToken}`,
    };

    transporter.sendMail(options, (error, info) => {
        if (error) {
            return res.sendStatus(403);
        }
        return res
            .status(200)
            .send(`http://localhost:5173/reset-password/${user_id}/${resetToken}`);
    });
};

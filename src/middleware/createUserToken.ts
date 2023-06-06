import { Request, Response } from "express";
import CryptoJS from "crypto-js";

export const createUserToken = (req: Request, res: Response) => {
    const userDetailsWithDate = { ...req.authenticatedUser, date: new Date().getTime() / 1000 };

    // create encrypted payload to send to be saved in localstorage
    const encUserDetails = CryptoJS.AES.encrypt(
        JSON.stringify(userDetailsWithDate),
        process.env.CRYPTO_HASHER!
    ).toString();
    return res.send(encUserDetails);
};

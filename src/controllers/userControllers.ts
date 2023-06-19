require("dotenv").config();

import { NextFunction, Request, Response } from "express";

import bcrypt from "bcrypt";

import RefreshToken from "../models/refreshTokenModel";
import User from "../models/userModel";
import Cart from "../models/cartModel";
import OrderList from "../models/orderListModel";
import CryptoJS from "crypto-js";

import { IUserModel } from "../types/UserModel";
import { refreshTokenFn, token } from "../security/authentication";
import { IOrderList } from "../types/OrderListModel";
import Product from "../models/productModel";

// Create User
export const createUser = async (req: Request, res: Response) => {
    try {
        const hashedCredentials = req.body.hashedCredentials;
        const decrypted = CryptoJS.AES.decrypt(hashedCredentials, process.env.CRYPTO_CRED_HASHER!);
        const stringedCredentials = decrypted.toString(CryptoJS.enc.Utf8);
        const decryptedCredentialsObject = JSON.parse(stringedCredentials);

        const emailDuplication = await User.findOne({ email: decryptedCredentialsObject.email });
        if (emailDuplication) return res.sendStatus(409);

        // Create New Cart
        const newCart = new Cart({
            items: [],
            cartOwner: null,
        });
        const newUserCart = await newCart.save();

        // Creat new Orders
        const newOrders = new OrderList<IOrderList>({
            orders: [],
            ordersOwner: null,
        });
        const newUserOrders = await newOrders.save();

        // Create new User
        const hashedPassword = await bcrypt.hash(decryptedCredentialsObject.password, 10);
        const newUser = new User<IUserModel>({
            email: decryptedCredentialsObject.email,
            password: hashedPassword,
            isSeller: false,
            userCart: null,
            userOrders: null,
            userPurchases: null,
        });
        const newRegisteredUser = await newUser.save();

        // Assign User ObjectId to newly created Cart and vice versa
        newUserCart.cartOwner = newRegisteredUser._id;
        await newUserCart.save();

        newUserOrders.ordersOwner = newRegisteredUser._id;
        await newUserOrders.save();

        newRegisteredUser.userCart = newUserCart._id;
        newRegisteredUser.userOrders = newUserOrders._id;
        await newRegisteredUser.save();

        res.send("user created");
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

// Login User
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hashedCredentials = req.body.hashedCredentials;
        const decrypted = CryptoJS.AES.decrypt(hashedCredentials, process.env.CRYPTO_CRED_HASHER!);
        const stringedCredentials = decrypted.toString(CryptoJS.enc.Utf8);
        const decryptedCredentialsObject = JSON.parse(stringedCredentials);

        // Find user with entered Email
        const user = await User.findOne({
            email: decryptedCredentialsObject.email,
        });
        if (!user) {
            return res.send("user not found");
        }

        // Check if passwords match
        const match = await bcrypt.compare(decryptedCredentialsObject.password, user.password);
        if (!match) {
            return res.send("wrong password");
        }

        // If everything is a-okay
        const userPayload = {
            email: user.email,
            _id: user._id,
            isSeller: user.isSeller,
        };

        // create jwt tokens from authentication.ts
        const tokens = token(userPayload);

        // check if tokens were created
        if (tokens.accessToken === "no secret code given for token creation")
            return res.send(tokens.accessToken);

        // add refresh token to DB
        const refrehsToken = new RefreshToken({
            refreshToken: tokens?.refreshToken,
        });
        await refrehsToken.save();

        // Send Access Token of user back as cookies
        res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        req.authenticatedUser = {
            email: user.email,
            _id: user._id.toString(),
            isSeller: user.isSeller,
        };
        return next();
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

export const refreshLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const userEmail = req.authenticatedUser.email;

        // check if refresh token is provided and valid
        if (!refreshToken) return res.send("no refresh token provided");
        const validRefreshToken = await RefreshToken.findOne({ refreshToken: refreshToken });
        if (!validRefreshToken) return res.send("tampered refresh token");

        // Generate new tokens
        const newTokens = refreshTokenFn(refreshToken, userEmail);

        // check if newTokens return new tokens or string if user and refreshToken does not match
        if (typeof newTokens == "string") {
            return res.send(newTokens);
        } else {
            const newRefreshToken = new RefreshToken({
                refreshToken: newTokens?.refreshToken,
            });
            // Delete old refresh token
            await RefreshToken.deleteOne({ refreshToken: refreshToken });

            // save new refresh token to DB
            await newRefreshToken.save();

            // return new tokens to user
            res.cookie("refreshToken", newTokens?.refreshToken);
            res.cookie("accessToken", newTokens?.accessToken);
            return next();
        }
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

export const updateSellerStatus = async (req: Request, res: Response) => {
    try {
        const user_id = req.params.user_id;
        const user = await User.findById(user_id);
        if (user) {
            if (user.isSeller == true) {
                await Product.deleteMany({ postedBy: user_id });
            }
            user.isSeller = !user.isSeller;
            await user.save();
            return res.send("OK");
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const user_id = req.params.user_id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const user = await User.findById(user_id);

        if (user) {
            const oldPasswordsMatch = await bcrypt.compare(oldPassword, user.password);
            if (oldPasswordsMatch) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                await user.save();
                return res.send("password changed");
            }
            return res.send("incorrect password");
        }
        return res.sendStatus(404);
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

// export const getUserProfileDetails = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user_id = req.authenticatedUser._id;
//         const user = await User.findById(user_id);
//         if (user) {
//             req.authenticatedUser.isSeller = user.isSeller;
//             return next();
//         }
//         return res.send("user not found");
//     } catch (error) {
//         if (error instanceof Error) {
//             res.send(error.message);
//         }
//     }
// };

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const deleted = await RefreshToken.deleteOne({ refreshToken: refreshToken });
            if (deleted.deletedCount != 0) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.send(deleted);
            }
            return res.send("nothing deleted");
        }
        return res.send("no refreshToken");
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const deleteCount = await User.deleteOne({ _id: user_id });
        return res.send(deleteCount);
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

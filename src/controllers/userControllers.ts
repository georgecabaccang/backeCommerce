require("dotenv").config();

import { Request, Response } from "express";

import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

import RefreshToken from "../models/refreshTokenModel";
import User from "../models/userModel";
import Cart from "../models/cartModel";
import OrderList from "../models/orderListModel";

import { IUserModel } from "../types/UserModel";
import { ICartModel } from "../types/CartModel";
import { refreshTokenFn, token } from "../security/authentication";
import { IOrderList } from "../types/OrderListModel";

// Create User
export const createUser = async (req: Request, res: Response) => {
    try {
        const userDetails = req.body;

        const emailDuplication = await User.findOne({ email: userDetails.email });
        if (emailDuplication) return res.sendStatus(409);

        // Create New Cart
        const newCart = new Cart<ICartModel>({
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
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        const newUser = new User<IUserModel>({
            email: userDetails.email,
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
export const login = async (req: Request, res: Response) => {
    try {
        const userCredentials = req.body;

        // Find user with entered Email
        const user = await User.findOne({
            email: userCredentials.email,
        });
        if (!user) {
            return res.send("user not found");
        }

        // Check if passwords match
        const match = await bcrypt.compare(userCredentials.password, user.password);
        if (!match) {
            res.send("wrong password");
            return;
        }

        // If everything is a-okay
        const userPayload = {
            email: user.email,
            _id: user._id,
            isSeller: user.isSeller,
        };

        // create encrypted payload to send to be saved in localstorage
        const encUserDetails = CryptoJS.AES.encrypt(
            JSON.stringify(userPayload),
            process.env.CRYPTO_HASHER!
        ).toString();

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
        return res.send(encUserDetails);
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

export const refreshLogin = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const userEmail = req.authenticatedUser.email;

        // check if refresh token is provided and valid
        if (!refreshToken) return res.send("no refresh token provided");
        const validRefreshToken = await RefreshToken.findOne({ refreshToken: refreshToken });
        if (!validRefreshToken) return res.send("refresh token not found");

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
            return res.send("OK");
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

export const getUserProfileDetails = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const user = await User.findById(user_id);
        if (user) {
            const userDetails = {
                email: user.email,
                _id: user._id,
                isSeller: user.isSeller,
            };
            const encUserDetails = CryptoJS.AES.encrypt(
                JSON.stringify(userDetails),
                process.env.CRYPTO_HASHER!
            ).toString();
            return res.send(encUserDetails);
        }
        return res.send("user not found");
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

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

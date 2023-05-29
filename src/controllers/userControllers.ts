import { Request, Response } from "express";

import RefreshToken from "../models/refreshTokenModel";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import Cart from "../models/cartModel";
import OrderList from "../models/orderListModel";
import PurchaseList from "../models/purchaseListModel";

import { IUserModel } from "../types/UserModel";
import { ICartModel } from "../types/CartModel";
import { refreshTokenFn, token } from "../security/authentication";
import { IOrderList } from "../types/OrderListModel";
// import { IPurchasesList } from "../types/PurchaseListModel";

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

        // // Creat new Purchases
        // const newPurchases = new PurchaseList<IPurchasesList>({
        //     purchases: [],
        //     purchasesOwner: null,
        // });
        // const newUserPurchases = await newPurchases.save();

        // Create new User
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        const newUser = new User<IUserModel>({
            email: userDetails.email,
            password: hashedPassword,
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

        // newUserPurchases.purchasesOwner = newRegisteredUser._id;
        // await newUserPurchases.save();

        newRegisteredUser.userCart = newUserCart._id;
        newRegisteredUser.userOrders = newUserOrders._id;
        // newRegisteredUser.userPurchases = newUserPurchases._id;
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
            // return res.sendStatus(404);
            return res.sendStatus(404);
        }

        // Check if passwords match
        const match = await bcrypt.compare(userCredentials.password, user.password);
        if (!match) {
            res.sendStatus(401);
            return;
        }

        // If everything is a-okay
        const userPayload = {
            email: user.email,
            _id: user._id,
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

        // Send Access Token of user back
        res.send({ tokens: tokens });
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

export const refreshLogin = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        const userEmail = req.body.email;
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
            res.send(newTokens);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        const deleted = await RefreshToken.deleteOne({ refreshToken: refreshToken });
        res.send(deleted);
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

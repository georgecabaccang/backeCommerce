import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import Cart from "../models/cartModel";
import { IUserModel } from "../types/UserModel";
import { ICartModel } from "../types/CartModel";
import { refreshTokenFn, token } from "../security/authentication";
import RefreshToken from "../models/refreshTokenModel";

// Create User
export const createUser = async (req: Request, res: Response) => {
    try {
        // Create New Cart
        const userDetails = req.body;
        const newCart = new Cart<ICartModel>({
            items: [],
            cartOwner: null,
        });
        const newUserCart = await newCart.save();

        // Create new User
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        const newUser = new User<IUserModel>({
            email: userDetails.email,
            password: hashedPassword,
            userCart: null,
        });
        const newRegisteredUser = await newUser.save();

        // Assign User ObjectId to newly created Cart and vice versa
        newUserCart.cartOwner = newRegisteredUser._id;
        await newUserCart.save();
        newRegisteredUser.userCart = newUserCart._id;
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
            res.send("user not found");
            return;
        }

        // Check if passwords match
        const match = await bcrypt.compare(userCredentials.password, user.password);
        if (!match) {
            res.send("incorrect password");
            return;
        }

        // If everything is a-okay
        const userPayload = {
            email: user.email,
            _id: user._id,
        };

        // create jwt tokens from authentication.ts
        const tokens = token(userPayload, userCredentials.loginTime);

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
            const refrehsToken = new RefreshToken({
                refreshToken: newTokens?.refreshToken,
            });
            // Delete old refresh token
            await RefreshToken.deleteOne({ refreshToken: refreshToken });

            // save new refresh token to DB
            await refrehsToken.save();

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
        if (deleted.deletedCount === 0) {
            return res.send(deleted.deletedCount);
        }
        res.send("logout successful");
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

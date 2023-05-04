import { Request, Response } from "express";
import bcrypt, { hash } from "bcrypt";
import User from "../models/userModel";
import Cart from "../models/cartModel";
import { IUserModel } from "../types/UserModel";
import { ICartModel } from "../types/CartModel";
import { token } from "../security/authentication";

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
        const user = await User.findOne<IUserModel>({
            email: userCredentials.email,
        });
        if (!user) {
            res.send("user not found");
            return;
        }

        // Check if passwords match
        const match = await bcrypt.compare(
            userCredentials.password,
            user.password
        );
        if (!match) {
            res.send("incorrect password");
            return;
        }

        // If everything is a-okay
        const userPayload = {
            email: user.email,
            password: user.password,
        };

        // create jwt token from authentication.ts
        const accessToken = token(userPayload);

        // Send Access Token of user back
        res.send(accessToken);
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

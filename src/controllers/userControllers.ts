import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import Cart from "../models/cartModel";
import { IUserModel } from "../types/UserModel";
import { ICartModel } from "../types/CartModel";

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
            username: userDetails.username,
            password: hashedPassword,
            userCart: null,
        });
        const newRegisteredUser = await newUser.save();

        // Assign User ObjectId to newly created Cart and vice versa
        newUserCart.cartOwner = newRegisteredUser._id;
        await newUserCart.save();
        newRegisteredUser.userCart = newUserCart._id;
        await newRegisteredUser.save();

        const qwioejqwe = [newUserCart, newRegisteredUser];
        res.send(qwioejqwe);
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
};

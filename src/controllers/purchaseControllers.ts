import { Request, Response } from "express";
import Cart from "../models/cartModel";
import CheckOut from "../models/checkOutModel";
import Purchase from "../models/purchaseModel";

export const getPurchases = async (req: Request, res: Response) => {};

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = await Cart.findOne({ cartOwner: user_id });
        const checkOutInstance = await CheckOut.findOne({ cart_id: userCart?._id });

        if (checkOutInstance) {
            const purchaseReceipt = new Purchase({
                itemsPurchased: checkOutInstance.items,
                totalAmountPaid: checkOutInstance.totalAmountToPay,
            });
            await purchaseReceipt.save();
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

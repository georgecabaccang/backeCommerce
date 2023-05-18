import { Request, Response } from "express";
import Cart from "../models/cartModel";
import CheckOut from "../models/checkOutModel";
import Order from "../models/orderModel";

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = await Cart.findOne({ cartOwner: user_id });
        const checkOutInstance = await CheckOut.findOne({ cart_id: userCart?._id });

        if (checkOutInstance) {
            const placedOrder = new Order({
                itemsOrdered: checkOutInstance.items,
                totalAmountToPay: checkOutInstance.totalAmountToPay,
                orderedBy: user_id,
            });
            await placedOrder.save();
            return res.send(placedOrder);
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

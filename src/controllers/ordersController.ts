import { Request, Response } from "express";
import Cart from "../models/cartModel";
import CheckOut from "../models/checkOutModel";
import OrderList from "../models/orderListModel";

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = await Cart.findOne({ cartOwner: user_id });
        const checkOutInstance = await CheckOut.findOne({ cart_id: userCart?._id });
        const userOrders = await OrderList.findOne({ ordersOwner: user_id });

        if (checkOutInstance && userOrders) {
            const toBePushed = {
                items: checkOutInstance.items,
                totalAmount: checkOutInstance.totalAmountToPay,
            };

            userOrders.orders.push(toBePushed);
            await userOrders.save();
            return res.sendStatus(200);
        }
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const user_id = req.authenticatedUser._id;
        const orders = await OrderList.findOne({ ordersOwner: user_id });
        return res.send(orders);
    } catch (error) {
        if (error instanceof Error) return res.send(error.message);
    }
};

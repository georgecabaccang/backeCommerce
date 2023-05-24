"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrders = exports.placeOrder = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const orderListModel_1 = __importDefault(require("../models/orderListModel"));
const placeOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        const userOrders = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        if (userOrders) {
            const toBePushed = {
                items: req.body.items,
                totalAmount: req.body.totalAmountToPay,
            };
            userOrders.orders.push(toBePushed);
            yield userOrders.save();
            next();
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.placeOrder = placeOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const orders = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        return res.send(orders);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getOrders = getOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const orders = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        if (orders) {
            const indexOfOrder = orders.orders.findIndex((order) => {
                return order._id == req.body.order_id;
            });
            if (indexOfOrder != -1) {
                orders.orders.splice(indexOfOrder, 1);
                yield orders.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(404);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.cancelOrder = cancelOrder;

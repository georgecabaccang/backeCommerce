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
exports.getOrders = exports.placeOrder = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const checkOutModel_1 = __importDefault(require("../models/checkOutModel"));
const orderListModel_1 = __importDefault(require("../models/orderListModel"));
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        const checkOutInstance = yield checkOutModel_1.default.findOne({ cart_id: userCart === null || userCart === void 0 ? void 0 : userCart._id });
        const userOrders = yield orderListModel_1.default.findOne({ ordersOwner: user_id });
        if (checkOutInstance && userOrders) {
            const toBePushed = {
                items: checkOutInstance.items,
                totalAmount: checkOutInstance.totalAmountToPay,
            };
            // res.send(toBePushed);
            userOrders.orders.push(toBePushed);
            yield userOrders.save();
            return res.sendStatus(200);
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
        const orders = yield orderListModel_1.default.find({ ordersOwner: user_id });
        return res.send(orders);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getOrders = getOrders;

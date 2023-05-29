"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderModel_1 = __importDefault(require("./orderModel"));
const orderListSchema = new mongoose_1.Schema({
    orders: [orderModel_1.default.schema],
    ordersOwner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
const OrderList = (0, mongoose_1.model)("OrderList", orderListSchema);
exports.default = OrderList;

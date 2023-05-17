"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemModel_1 = __importDefault(require("./itemModel"));
const checkOutModel = new mongoose_1.Schema({
    items: [itemModel_1.default.schema],
    totalAmountToPay: { type: Number, required: true },
    cart_id: { type: mongoose_1.Types.ObjectId, ref: "Cart" },
    expireAt: {
        type: Date,
        expires: 2,
        default: Date.now,
    },
});
const CheckOut = (0, mongoose_1.model)("CheckOut", checkOutModel);
exports.default = CheckOut;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemModel_1 = __importDefault(require("./itemModel"));
const cartSchema = new mongoose_1.Schema({
    items: [itemModel_1.default.schema],
    cartOwner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
const Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.default = Cart;

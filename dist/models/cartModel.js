"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    items: [],
});
const Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.default = Cart;

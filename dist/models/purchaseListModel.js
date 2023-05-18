"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderListModel_1 = __importDefault(require("./orderListModel"));
const purchaseListSchema = new mongoose_1.Schema({
    purchases: [orderListModel_1.default.schema],
    purchasesOwner: { type: mongoose_1.Types.ObjectId, ref: "User" },
}, { timestamps: true });
const PurchaseList = (0, mongoose_1.model)("Purchase", purchaseListSchema);
exports.default = PurchaseList;

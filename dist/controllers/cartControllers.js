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
exports.addToCart = exports.getUserCart = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const itemModel_1 = __importDefault(require("../models/itemModel"));
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.authenticatedUser;
        if (user._id) {
            const cartOfUser = yield cartModel_1.default.findOne({ cartOwner: user._id });
            return res.send(cartOfUser === null || cartOfUser === void 0 ? void 0 : cartOfUser.items);
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getUserCart = getUserCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemToCart = req.body;
        const addItemToCart = new itemModel_1.default({});
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.addToCart = addToCart;

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
const productModel_1 = __importDefault(require("../models/productModel"));
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
        // Find product in database
        const product = yield productModel_1.default.findOne({ _id: itemToCart.productID });
        // Get user's cart
        const userCart = yield cartModel_1.default.findOne({ cartOwner: req.authenticatedUser._id });
        if (userCart) {
            if (product) {
                // create object with product's properties
                const addItemToCart = {
                    productName: product.productName,
                    price: product.price,
                    image: product.image,
                    stock: product.stock,
                    discount: product.discount,
                    productID: itemToCart.productID,
                    quantity: itemToCart.quantity,
                };
                // push item to user's cart items array
                userCart === null || userCart === void 0 ? void 0 : userCart.items.push(addItemToCart);
                yield userCart.save();
                res.send(userCart);
            }
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.addToCart = addToCart;

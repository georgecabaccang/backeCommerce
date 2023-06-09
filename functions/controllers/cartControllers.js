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
exports.getItemDetails = exports.changeQuantity = exports.removeFromCart = exports.addToCart = exports.getUserCart = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        if (user_id) {
            const cartOfUser = yield cartModel_1.default.findOne({ cartOwner: user_id });
            return res.send(cartOfUser);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getUserCart = getUserCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const product_id = req.body.prod_id;
        const intialQuantity = req.body.quantity;
        // Find product in database
        const product = yield productModel_1.default.findOne({ _id: product_id });
        // Get user's cart
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        if (userCart) {
            if (product) {
                // Check if product is already in userCart
                const productIndexInCart = userCart.items.findIndex((item) => {
                    return item.prod_id === product_id.prod_id;
                });
                // If product is already in cart
                if (productIndexInCart != -1) {
                    userCart.items[productIndexInCart].quantity += product_id.quantity;
                }
                // If product is not in cart
                if (productIndexInCart == -1) {
                    // create object with product's properties
                    const addItemToCart = {
                        prod_id: product._id,
                        image: product.image,
                        productName: product.productName,
                        description: product.description,
                        price: product.price,
                        discount: product.discount,
                        discountedPrice: product.discountedPrice,
                        quantity: intialQuantity,
                    };
                    // push item to user's cart items array
                    userCart.items.push(addItemToCart);
                }
                // save updated cart
                yield userCart.save();
                return res.sendStatus(200);
            }
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prod_id = req.body.prod_id;
        const user_id = req.authenticatedUser._id;
        const cart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        if (cart) {
            const indexOfItemInCart = cart.items.findIndex((item) => {
                return item.prod_id == prod_id;
            });
            if (indexOfItemInCart != -1) {
                if (cart.items[indexOfItemInCart].quantity == 1) {
                    cart.items.splice(indexOfItemInCart, 1);
                }
                yield cart.save();
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
exports.removeFromCart = removeFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quantity = req.body.quantity;
        const prod_id = req.body.prod_id;
        const user_id = req.authenticatedUser._id;
        const cart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        if (cart) {
            const indexOfItemInCart = cart.items.findIndex((item) => {
                return item.prod_id == prod_id;
            });
            if (indexOfItemInCart != -1) {
                cart.items[indexOfItemInCart].quantity = quantity;
                // save updated quantity of item in cart
                yield cart.save();
                return res.send("OK");
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
exports.changeQuantity = changeQuantity;
const getItemDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prod_id = req.body.prod_id;
        const user_id = req.authenticatedUser._id;
        const cart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        if (cart) {
            const indexOfItemInCart = cart.items.findIndex((item) => {
                return item.prod_id == prod_id;
            });
            if (indexOfItemInCart != -1) {
                return res.send(cart.items[indexOfItemInCart]);
            }
        }
        return res.send("item not in cart");
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getItemDetails = getItemDetails;

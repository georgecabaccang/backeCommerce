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
exports.getToCheckOutItems = exports.removeFromCheckOut = exports.addToCheckOut = exports.changeQuantity = exports.removeFromCart = exports.addToCart = exports.getUserCart = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const checkOutModel_1 = __importDefault(require("../models/checkOutModel"));
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        if (user_id) {
            const cartOfUser = yield cartModel_1.default.findOne({ cartOwner: user_id });
            return res.send(cartOfUser === null || cartOfUser === void 0 ? void 0 : cartOfUser.items);
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
        const itemToCart = req.body;
        // Find product in database
        const product = yield productModel_1.default.findOne({ _id: itemToCart.prod_id });
        // Get user's cart
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        if (userCart) {
            if (product) {
                // Check if product is already in userCart
                const productIndexInCart = userCart === null || userCart === void 0 ? void 0 : userCart.items.findIndex((item) => {
                    return item.prod_id === itemToCart.prod_id;
                });
                // If product is already in cart
                if (productIndexInCart != -1) {
                    userCart.items[productIndexInCart].quantity += itemToCart.quantity;
                }
                // If product is not in cart
                if (productIndexInCart == -1) {
                    // create object with product's properties
                    const addItemToCart = {
                        productName: product.productName,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        stock: product.stock,
                        discount: product.discount,
                        prod_id: itemToCart.prod_id,
                        quantity: itemToCart.quantity,
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
        const user_id = req.authenticatedUser._id;
        const prod_id = req.body.prod_id;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        if (userCart) {
            const indexOfItemInCart = userCart.items.findIndex((item) => {
                return item.prod_id === prod_id;
            });
            if (indexOfItemInCart != 1) {
                if (userCart.items[indexOfItemInCart].quantity != 1) {
                    userCart.items[indexOfItemInCart].quantity--;
                }
                if (userCart.items[indexOfItemInCart].quantity == 1) {
                    userCart.items.splice(indexOfItemInCart, 1);
                }
                yield userCart.save();
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
        const user_id = req.authenticatedUser._id;
        const quantity = req.body.quantity;
        const prod_id = req.body.prod_id;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        if (userCart) {
            const productIndexInCart = userCart === null || userCart === void 0 ? void 0 : userCart.items.findIndex((item) => {
                return item.prod_id === prod_id;
            });
            if (productIndexInCart != -1) {
                userCart.items[productIndexInCart].quantity = quantity;
                // save updated quantity of item in cart
                yield userCart.save();
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
exports.changeQuantity = changeQuantity;
const addToCheckOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const itemToCheckOut = req.body.itemToCheckOut;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        const checkOutInstance = yield checkOutModel_1.default.findOne({
            cart_id: userCart === null || userCart === void 0 ? void 0 : userCart._id,
        });
        if (!checkOutInstance) {
            const newCheckOut = new checkOutModel_1.default({
                items: [itemToCheckOut],
                totalAmountToPay: itemToCheckOut.price * itemToCheckOut.quantity,
                cart_id: userCart === null || userCart === void 0 ? void 0 : userCart._id,
            });
            yield newCheckOut.save();
            return res.sendStatus(200);
        }
        if (checkOutInstance) {
            const indexOfItemInCheckOutInstance = checkOutInstance.items.findIndex((item) => {
                return item.prod_id === itemToCheckOut.prod_id;
            });
            if (indexOfItemInCheckOutInstance != -1) {
                checkOutInstance.items[indexOfItemInCheckOutInstance].quantity =
                    itemToCheckOut.quantity;
                // !!!!!!!!!!!!!!!!!! CHECK IF STILL NEED SECOND INSTANCE
                yield checkOutInstance.save();
                const checkOutInstanceTwo = yield checkOutModel_1.default.findOne({
                    cart_id: userCart === null || userCart === void 0 ? void 0 : userCart._id,
                });
                if (checkOutInstanceTwo) {
                    let newTotalAmountToPay = 0;
                    checkOutInstanceTwo.items.forEach((item) => {
                        if (item.price && item.quantity)
                            newTotalAmountToPay += item.price * item.quantity;
                    });
                    checkOutInstance.totalAmountToPay = newTotalAmountToPay;
                }
            }
            if (indexOfItemInCheckOutInstance == -1) {
                checkOutInstance.items.push(itemToCheckOut);
                checkOutInstance.totalAmountToPay += itemToCheckOut.price * itemToCheckOut.quantity;
            }
            yield checkOutInstance.save();
            return res.sendStatus(200);
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.addToCheckOut = addToCheckOut;
const removeFromCheckOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const itemToRemove = req.body.itemToRemove;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        const checkOutInstance = yield checkOutModel_1.default.findOne({ cart_id: userCart === null || userCart === void 0 ? void 0 : userCart._id });
        if (checkOutInstance) {
            const indexOfItemInCheckOutInstance = checkOutInstance.items.findIndex((item) => {
                return item.prod_id === itemToRemove;
            });
            if (indexOfItemInCheckOutInstance != -1) {
                checkOutInstance.totalAmountToPay -=
                    checkOutInstance.items[indexOfItemInCheckOutInstance].price *
                        checkOutInstance.items[indexOfItemInCheckOutInstance].quantity;
                checkOutInstance.items.splice(indexOfItemInCheckOutInstance, 1);
                yield checkOutInstance.save();
                return res.sendStatus(200);
            }
        }
        return res.send("no items to check out found");
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.removeFromCheckOut = removeFromCheckOut;
const getToCheckOutItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const userCart = yield cartModel_1.default.findOne({ cartOwner: user_id });
        const toCheckOutItems = yield checkOutModel_1.default.findOne({ cart_id: userCart === null || userCart === void 0 ? void 0 : userCart._id });
        if (toCheckOutItems) {
            return res.send(toCheckOutItems);
        }
        return res.send("no items to check out found");
    }
    catch (error) {
        if (error instanceof Error)
            return res.send(error.message);
    }
});
exports.getToCheckOutItems = getToCheckOutItems;

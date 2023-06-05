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
exports.logout = exports.changePassword = exports.updateSellerStatus = exports.refreshLogin = exports.login = exports.createUser = void 0;
require("dotenv").config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const refreshTokenModel_1 = __importDefault(require("../models/refreshTokenModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const orderListModel_1 = __importDefault(require("../models/orderListModel"));
const authentication_1 = require("../security/authentication");
// Create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = req.body;
        const emailDuplication = yield userModel_1.default.findOne({ email: userDetails.email });
        if (emailDuplication)
            return res.sendStatus(409);
        // Create New Cart
        const newCart = new cartModel_1.default({
            items: [],
            cartOwner: null,
        });
        const newUserCart = yield newCart.save();
        // Creat new Orders
        const newOrders = new orderListModel_1.default({
            orders: [],
            ordersOwner: null,
        });
        const newUserOrders = yield newOrders.save();
        // Create new User
        const hashedPassword = yield bcrypt_1.default.hash(userDetails.password, 10);
        const newUser = new userModel_1.default({
            email: userDetails.email,
            password: hashedPassword,
            isSeller: false,
            userCart: null,
            userOrders: null,
            userPurchases: null,
        });
        const newRegisteredUser = yield newUser.save();
        // Assign User ObjectId to newly created Cart and vice versa
        newUserCart.cartOwner = newRegisteredUser._id;
        yield newUserCart.save();
        newUserOrders.ordersOwner = newRegisteredUser._id;
        yield newUserOrders.save();
        newRegisteredUser.userCart = newUserCart._id;
        newRegisteredUser.userOrders = newUserOrders._id;
        yield newRegisteredUser.save();
        res.send("user created");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.createUser = createUser;
// Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCredentials = req.body;
        // Find user with entered Email
        const user = yield userModel_1.default.findOne({
            email: userCredentials.email,
        });
        if (!user) {
            return res.sendStatus(404);
        }
        // Check if passwords match
        const match = yield bcrypt_1.default.compare(userCredentials.password, user.password);
        if (!match) {
            res.sendStatus(401);
            return;
        }
        // If everything is a-okay
        const userPayload = {
            email: user.email,
            _id: user._id,
            isSeller: user.isSeller,
        };
        // create encrypted payload to send to be saved in localstorage
        const encUserDetails = crypto_js_1.default.AES.encrypt(JSON.stringify(userPayload), process.env.CRYPTO_HASHER).toString();
        // create jwt tokens from authentication.ts
        const tokens = (0, authentication_1.token)(userPayload);
        // check if tokens were created
        if (tokens.accessToken === "no secret code given for token creation")
            return res.send(tokens.accessToken);
        // add refresh token to DB
        const refrehsToken = new refreshTokenModel_1.default({
            refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken,
        });
        yield refrehsToken.save();
        // Send Access Token of user back as cookies
        res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        return res.send(encUserDetails);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.login = login;
const refreshLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.body.refreshToken;
        const userEmail = req.authenticatedUser.email;
        // check if refresh token is provided and valid
        if (!refreshToken)
            return res.send("no refresh token provided");
        const validRefreshToken = yield refreshTokenModel_1.default.findOne({ refreshToken: refreshToken });
        if (!validRefreshToken)
            return res.send("refresh token not found");
        // Generate new tokens
        const newTokens = (0, authentication_1.refreshTokenFn)(refreshToken, userEmail);
        // check if newTokens return new tokens or string if user and refreshToken does not match
        if (typeof newTokens == "string") {
            return res.send(newTokens);
        }
        else {
            const newRefreshToken = new refreshTokenModel_1.default({
                refreshToken: newTokens === null || newTokens === void 0 ? void 0 : newTokens.refreshToken,
            });
            // Delete old refresh token
            yield refreshTokenModel_1.default.deleteOne({ refreshToken: refreshToken });
            // save new refresh token to DB
            yield newRefreshToken.save();
            // return new tokens to user
            res.send(newTokens);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.refreshLogin = refreshLogin;
const updateSellerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.user_id;
        const user = yield userModel_1.default.findById(user_id);
        if (user) {
            user.isSeller = !user.isSeller;
            yield user.save();
            return res.send({ _id: user._id, email: user.email, isSeller: user.isSeller });
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.updateSellerStatus = updateSellerStatus;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.user_id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const user = yield userModel_1.default.findById(user_id);
        if (user) {
            const oldPasswordsMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
            if (oldPasswordsMatch) {
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                user.password = hashedPassword;
                yield user.save();
                return res.send("password changed");
            }
            return res.send("incorrect password");
        }
        return res.sendStatus(404);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.changePassword = changePassword;
// export const getUserProfileDetails = async (req: Request, res: Response) => {
//     try {
//         const user_id = req.authenticatedUser.email;
//         const user = await User.findById(user_id);
//         if (user) {
//             const userDetails = {
//                 email: user.email,
//                 _id: user._id,
//                 isSeller: user.isSeller,
//             };
//             return res.send(user_id);
//         }
//     } catch (error) {
//         if (error instanceof Error) {
//             res.send(error.message);
//         }
//     }
// };
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.body.refreshToken;
        const deleted = yield refreshTokenModel_1.default.deleteOne({ refreshToken: refreshToken });
        res.send(deleted);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.logout = logout;

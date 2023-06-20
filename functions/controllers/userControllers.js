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
exports.setNewPassword = exports.createForgotPasswordToken = exports.deleteUser = exports.logout = exports.changePassword = exports.updateSellerStatus = exports.refreshLogin = exports.login = exports.createUser = void 0;
require("dotenv").config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const refreshTokenModel_1 = __importDefault(require("../models/refreshTokenModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const orderListModel_1 = __importDefault(require("../models/orderListModel"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const authentication_1 = require("../security/authentication");
const productModel_1 = __importDefault(require("../models/productModel"));
const resetPasswordModel_1 = __importDefault(require("../models/resetPasswordModel"));
// Create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedCredentials = req.body.hashedCredentials;
        const decrypted = crypto_js_1.default.AES.decrypt(hashedCredentials, process.env.CRYPTO_CRED_HASHER);
        const stringedCredentials = decrypted.toString(crypto_js_1.default.enc.Utf8);
        const decryptedCredentialsObject = JSON.parse(stringedCredentials);
        const emailDuplication = yield userModel_1.default.findOne({ email: decryptedCredentialsObject.email });
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
        const encryptedPassword = yield bcrypt_1.default.hash(decryptedCredentialsObject.password, 10);
        const newUser = new userModel_1.default({
            email: decryptedCredentialsObject.email,
            password: encryptedPassword,
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
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedCredentials = req.body.hashedCredentials;
        const decrypted = crypto_js_1.default.AES.decrypt(hashedCredentials, process.env.CRYPTO_CRED_HASHER);
        const stringedCredentials = decrypted.toString(crypto_js_1.default.enc.Utf8);
        const decryptedCredentialsObject = JSON.parse(stringedCredentials);
        // Find user with entered Email
        const user = yield userModel_1.default.findOne({
            email: decryptedCredentialsObject.email,
        });
        if (!user) {
            return res.send("user not found");
        }
        // Check if passwords match
        const match = yield bcrypt_1.default.compare(decryptedCredentialsObject.password, user.password);
        if (!match) {
            return res.send("wrong password");
        }
        // If everything is a-okay
        const userPayload = {
            email: user.email,
            _id: user._id,
            isSeller: user.isSeller,
        };
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
        req.authenticatedUser = {
            email: user.email,
            _id: user._id.toString(),
            isSeller: user.isSeller,
        };
        return next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.login = login;
const refreshLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        const userEmail = req.authenticatedUser.email;
        // check if refresh token is provided and valid
        if (!refreshToken)
            return res.send("no refresh token provided");
        const validRefreshToken = yield refreshTokenModel_1.default.findOne({ refreshToken: refreshToken });
        if (!validRefreshToken)
            return res.send("tampered refresh token");
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
            res.cookie("refreshToken", newTokens === null || newTokens === void 0 ? void 0 : newTokens.refreshToken);
            res.cookie("accessToken", newTokens === null || newTokens === void 0 ? void 0 : newTokens.accessToken);
            return next();
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
            if (user.isSeller == true) {
                yield productModel_1.default.deleteMany({ postedBy: user_id });
            }
            user.isSeller = !user.isSeller;
            yield user.save();
            return res.send("OK");
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
// export const getUserProfileDetails = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user_id = req.authenticatedUser._id;
//         const user = await User.findById(user_id);
//         if (user) {
//             req.authenticatedUser.isSeller = user.isSeller;
//             return next();
//         }
//         return res.send("user not found");
//     } catch (error) {
//         if (error instanceof Error) {
//             res.send(error.message);
//         }
//     }
// };
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const deleted = yield refreshTokenModel_1.default.deleteOne({ refreshToken: refreshToken });
            if (deleted.deletedCount != 0) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.send(deleted);
            }
            return res.send("nothing deleted");
        }
        return res.send("no refreshToken");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.logout = logout;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.authenticatedUser._id;
        const deleteCount = yield userModel_1.default.deleteOne({ _id: user_id });
        return res.send(deleteCount);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.deleteUser = deleteUser;
// FORGOT PASSWORD SECTION ---------------------------------------
const ID_SPLICE = +process.env.ID_SPLICE;
const STRING_SPLICE = +process.env.STRING_SPLICE;
const COMBO_SPLICE = +process.env.COMBO_SPLICE;
const MAHANT = process.env.MAHANT;
const YEHER = process.env.YEHER;
const createForgotPasswordToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield userModel_1.default.findOne({ email: email });
        if (user) {
            const randString = crypto_1.default.randomBytes(69).toString("hex").split("");
            const stringToDB = randString.join("");
            const user_id = user._id.toString().split("");
            user_id.splice(ID_SPLICE, 0, MAHANT);
            randString.splice(STRING_SPLICE, 0, YEHER);
            randString.splice(COMBO_SPLICE, 0, ...user_id);
            const completedString = randString.join("");
            const token = yield (0, authentication_1.resetPasswordToken)(completedString, user_id.length + MAHANT.length);
            const hashedDetails = encodeURIComponent(crypto_js_1.default.AES.encrypt(JSON.stringify({ resetToken: token }), process.env.CRYPTO_PRE_HASHER).toString());
            const newResetPasswordToken = new resetPasswordModel_1.default({
                resetToken: stringToDB,
            });
            yield newResetPasswordToken.save();
            req.resetToken = hashedDetails;
            req.authenticatedUser = { email: user.email, _id: user._id.toString() };
            return next();
        }
        return res.status(404).send("user not found");
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.createForgotPasswordToken = createForgotPasswordToken;
const setNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.user_id;
        const resetPasswordToken = req.params.resetPasswordToken;
        const hashedNewPassword = req.body.data.newPassword;
        if (resetPasswordToken) {
            const decrypted = crypto_js_1.default.AES.decrypt(resetPasswordToken, process.env.CRYPTO_PRE_HASHER);
            const stringedToken = decrypted.toString(crypto_js_1.default.enc.Utf8);
            const decryptedTokenObject = JSON.parse(stringedToken);
            const payload = (yield (0, authentication_1.verifyPasswordToken)(decryptedTokenObject.resetToken));
            if (payload) {
                const idLength = payload.idLength;
                const completedStringArrayForm = payload.completedString.split("");
                const dirtyUser_id = completedStringArrayForm.splice(COMBO_SPLICE + 1, idLength - 1);
                const cleanedUser_id = dirtyUser_id.join("").replace(MAHANT, "");
                completedStringArrayForm.splice(STRING_SPLICE, YEHER.length);
                const cleanedCompletedString = completedStringArrayForm.join("");
                if (user_id === cleanedUser_id) {
                    const tokenInDB = yield resetPasswordModel_1.default.findOne({
                        resetToken: cleanedCompletedString,
                    });
                    if (tokenInDB) {
                        const user = yield userModel_1.default.findById(user_id);
                        if (user) {
                            const decrypted = crypto_js_1.default.AES.decrypt(hashedNewPassword, process.env.CRYPTO_PASSWORD_HASHER);
                            const stringedNewPassword = decrypted.toString(crypto_js_1.default.enc.Utf8);
                            const decryptedNewPassword = JSON.parse(stringedNewPassword);
                            const encryptedNewPassword = yield bcrypt_1.default.hash(decryptedNewPassword, 10);
                            user.password = encryptedNewPassword;
                            yield user.save();
                            yield resetPasswordModel_1.default.deleteOne({
                                resetToken: cleanedCompletedString,
                            });
                            return res.status(204).send("new password set");
                        }
                        return res.status(404).send("user not found");
                    }
                    return res.status(498).send("expired token");
                }
                return res.status(401).send("IDs don't match");
            }
            return res.status(404).send("no reset token");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.setNewPassword = setNewPassword;

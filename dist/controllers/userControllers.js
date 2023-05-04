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
exports.login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const authentication_1 = require("../security/authentication");
// Create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create New Cart
        const userDetails = req.body;
        const newCart = new cartModel_1.default({
            items: [],
            cartOwner: null,
        });
        const newUserCart = yield newCart.save();
        // Create new User
        const hashedPassword = yield bcrypt_1.default.hash(userDetails.password, 10);
        const newUser = new userModel_1.default({
            email: userDetails.email,
            password: hashedPassword,
            userCart: null,
        });
        const newRegisteredUser = yield newUser.save();
        // Assign User ObjectId to newly created Cart and vice versa
        newUserCart.cartOwner = newRegisteredUser._id;
        yield newUserCart.save();
        newRegisteredUser.userCart = newUserCart._id;
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
            res.send("user not found");
            return;
        }
        // Check if passwords match
        const match = yield bcrypt_1.default.compare(userCredentials.password, user.password);
        if (!match) {
            res.send("incorrect password");
            return;
        }
        // If everything is a-okay
        const userPayload = {
            _id: user._id,
            email: user.email,
            password: user.password,
        };
        // create jwt token from authentication.ts
        const accessToken = (0, authentication_1.token)(userPayload);
        // Send Access Token of user back
        res.send({ accessToken: accessToken });
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
});
exports.login = login;

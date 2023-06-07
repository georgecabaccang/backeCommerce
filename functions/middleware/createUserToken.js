"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const createUserToken = (req, res) => {
    const userDetailsWithDate = Object.assign(Object.assign({}, req.authenticatedUser), { date: new Date().getTime() / 1000 });
    // create encrypted payload to send to be saved in localstorage
    const encUserDetails = crypto_js_1.default.AES.encrypt(JSON.stringify(userDetailsWithDate), process.env.CRYPTO_HASHER).toString();
    return res.send(encUserDetails);
};
exports.createUserToken = createUserToken;

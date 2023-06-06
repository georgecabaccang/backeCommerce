"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const createUserToken = (req, res) => {
    const userDetailsWithDate = Object.assign(Object.assign({}, req.authenticatedUser), { date: new Date().getTime() / 1000 });
    // create encrypted payload to send to be saved in localstorage
    const encUserDetails = CryptoJS.AES.encrypt(JSON.stringify(userDetailsWithDate), process.env.CRYPTO_HASHER).toString();
    return res.send(encUserDetails);
};
exports.createUserToken = createUserToken;

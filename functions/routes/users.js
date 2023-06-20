"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const authentication_1 = require("../security/authentication");
const createUserToken_1 = require("../middleware/createUserToken");
const emailFunctions_1 = require("../utils/emailFunctions");
const userRoutes = express_1.default.Router();
userRoutes.get("/all-users");
userRoutes.post("/profile-details", authentication_1.authToken, createUserToken_1.createUserToken);
userRoutes.patch("/:user_id/update-user-type", authentication_1.authToken, userControllers_1.updateSellerStatus);
userRoutes.patch("/:user_id/change-password", authentication_1.authToken, userControllers_1.changePassword);
userRoutes.post("/register", userControllers_1.createUser);
userRoutes.post("/login", userControllers_1.login, createUserToken_1.createUserToken);
userRoutes.post("/refreshlogin", authentication_1.authToken, userControllers_1.refreshLogin, createUserToken_1.createUserToken);
userRoutes.delete("/logout", userControllers_1.logout);
userRoutes.post("/delete-account", authentication_1.authToken, userControllers_1.deleteUser);
userRoutes.post("/reset-password", userControllers_1.createForgotPasswordToken, emailFunctions_1.sendResetLink);
userRoutes.patch("/:user_id/set-new-password/:resetPasswordToken", userControllers_1.setNewPassword);
userRoutes.get("/reset-token-check/:resetPasswordToken", userControllers_1.checkIfLinkHasExpired);
exports.default = userRoutes;

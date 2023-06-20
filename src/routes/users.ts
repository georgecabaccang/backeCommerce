import express from "express";
import {
    changePassword,
    createForgotPasswordToken,
    createUser,
    deleteUser,
    login,
    logout,
    refreshLogin,
    setNewPassword,
    updateSellerStatus,
} from "../controllers/userControllers";
import { authToken } from "../security/authentication";
import { createUserToken } from "../middleware/createUserToken";
import { sendResetLink } from "../utils/emailFunctions";

const userRoutes = express.Router();

userRoutes.get("/all-users");
userRoutes.post("/profile-details", authToken, createUserToken);
userRoutes.patch("/:user_id/update-user-type", authToken, updateSellerStatus);
userRoutes.patch("/:user_id/change-password", authToken, changePassword);
userRoutes.post("/register", createUser);
userRoutes.post("/login", login, createUserToken);
userRoutes.post("/refreshlogin", authToken, refreshLogin, createUserToken);
userRoutes.delete("/logout", logout);
userRoutes.post("/delete-account", authToken, deleteUser);
userRoutes.post("/reset-password", createForgotPasswordToken, sendResetLink);
userRoutes.patch("/:user_id/set-new-password/:resetPasswordToken", setNewPassword);

export default userRoutes;

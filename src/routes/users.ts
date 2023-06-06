import express from "express";
import {
    changePassword,
    createUser,
    getUserProfileDetails,
    login,
    logout,
    refreshLogin,
    updateSellerStatus,
} from "../controllers/userControllers";
import { authToken } from "../security/authentication";
import { createUserToken } from "../middleware/createUserToken";

const userRoutes = express.Router();

userRoutes.get("/all-users");
userRoutes.post("/profile-details", authToken, getUserProfileDetails, createUserToken);
userRoutes.patch("/:user_id/update-user-type", authToken, updateSellerStatus);
userRoutes.patch("/:user_id/change-password", authToken, changePassword);
userRoutes.post("/register", createUser);
userRoutes.post("/login", login, createUserToken);
userRoutes.post("/refreshlogin", authToken, refreshLogin, createUserToken);
userRoutes.delete("/logout", logout);

export default userRoutes;

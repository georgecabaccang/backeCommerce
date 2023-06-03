import express from "express";
import {
    changePassword,
    createUser,
    login,
    logout,
    refreshLogin,
    updateSellerStatus,
} from "../controllers/userControllers";
import { authToken } from "../security/authentication";

const userRoutes = express.Router();

userRoutes.get("/all-users");
userRoutes.patch("/:user_id/update-user-type", authToken, updateSellerStatus);
userRoutes.patch("/:user_id/change-password", authToken, changePassword);
userRoutes.post("/register", createUser);
userRoutes.post("/login", login);
userRoutes.post("/refreshlogin", refreshLogin);
userRoutes.post("/logout", logout);

export default userRoutes;

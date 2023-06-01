import express from "express";
import {
    createUser,
    getUserProfile,
    login,
    logout,
    refreshLogin,
} from "../controllers/userControllers";
import { authToken } from "../security/authentication";

const userRoutes = express.Router();

userRoutes.get("/all-users");
userRoutes.get("/profile/:user_id}", authToken, getUserProfile);
userRoutes.post("/register", createUser);
userRoutes.post("/login", login);
userRoutes.post("/refreshlogin", refreshLogin);
userRoutes.post("/logout", logout);

export default userRoutes;

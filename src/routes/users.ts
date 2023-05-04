import express from "express";
import {
    createUser,
    login,
    refreshLogin,
} from "../controllers/userControllers";

const userRoutes = express.Router();

userRoutes.get("/all-users");
userRoutes.post("/register", createUser);
userRoutes.post("/login", login);
userRoutes.post("/refreshlogin", refreshLogin);

export default userRoutes;

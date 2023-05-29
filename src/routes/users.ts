import express from "express";
import { createUser, login, logout, refreshLogin } from "../controllers/userControllers";

const userRoutes = express.Router();

userRoutes.get("/test", (req, res) => {
    res.send("from user");
});
userRoutes.get("/all-users");
userRoutes.post("/register", createUser);
userRoutes.post("/login", login);
userRoutes.post("/refreshlogin", refreshLogin);
userRoutes.post("/logout", logout);

export default userRoutes;

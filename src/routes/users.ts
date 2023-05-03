import express from "express";
import { createUser, login } from "../controllers/userControllers";

const userRoutes = express.Router();

userRoutes.get("/all-users");
userRoutes.post("/register", createUser);
userRoutes.post("/login", login);

export default userRoutes;

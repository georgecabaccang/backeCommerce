import express from "express";
import { createUser } from "../controllers/userControllers";

const userRoutes = express.Router();

userRoutes.get("/all-users");
userRoutes.post("/register", createUser);

export default userRoutes;

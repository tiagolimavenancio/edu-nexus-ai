import express from "express";

const userRoutes = express.Router();

import { login, registerUser } from "../controllers/user";

userRoutes.post("/register", registerUser);
userRoutes.post("/login", login);

export default userRoutes;

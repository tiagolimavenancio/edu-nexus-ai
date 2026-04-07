import express from "express";

const userRoutes = express.Router();

import { login, registerUser } from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";

userRoutes.post("/register", protect, authorize(["admin", "teacher"]), registerUser);
userRoutes.post("/login", login);

export default userRoutes;

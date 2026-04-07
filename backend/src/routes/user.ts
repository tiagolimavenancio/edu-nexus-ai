import express from "express";

const userRoutes = express.Router();

import { login, registerUser, updateUser } from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";

userRoutes.post("/register", protect, authorize(["admin", "teacher"]), registerUser);
userRoutes.post("/login", login);
userRoutes.put("/update/:id", protect, authorize(["admin", "teacher"]), updateUser);

export default userRoutes;

import express from "express";

const userRoutes = express.Router();

import {
  deleteUser,
  getUserProfile,
  login,
  logout,
  registerUser,
  updateUser,
} from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";

userRoutes.post("/register", protect, authorize(["admin", "teacher"]), registerUser);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.get("/profile", protect, getUserProfile);

userRoutes.put("/update/:id", protect, authorize(["admin", "teacher"]), updateUser);
userRoutes.delete("/delete/:id", protect, authorize(["admin", "teacher"]), deleteUser);

export default userRoutes;

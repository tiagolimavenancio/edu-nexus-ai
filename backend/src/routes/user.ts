import express from "express";
import {
  deleteUser,
  getUserProfile,
  getUsers,
  login,
  logout,
  registerUser,
  updateUser,
} from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.post("/register", protect, authorize(["admin", "teacher"]), registerUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.get("/", protect, authorize(["admin", "teacher"]), getUsers);
userRouter.get("/profile", protect, getUserProfile);

userRouter.put("/update/:id", protect, authorize(["admin", "teacher"]), updateUser);
userRouter.delete("/delete/:id", protect, authorize(["admin", "teacher"]), deleteUser);

export default userRouter;

import { type Request, type Response } from "express";
import User from "../models/user";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, studentClass, teacherSubject, isActive } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      studentClass,
      teacherSubject,
      isActive,
    });

    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        studentClass: newUser.studentClass,
        teacherSubject: newUser.teacherSubject,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

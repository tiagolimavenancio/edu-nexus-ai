import { type Request, type Response } from "express";
import User from "../models/user";
import { generateToken } from "../utils/generateToken";
import { logActivity } from "../utils/activitieslog";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Private (Admin & Teacher only)
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
      if ((req as any).user) {
        await logActivity({
          userId: (req as any).user._id,
          action: "Registered user",
          details: `Registered user with email: ${newUser.email}`,
        });
      }

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

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(user.id.toString(), res);
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
      user.studentClass = req.body.studentClass || user.studentClass;
      user.teacherSubject = req.body.teacherSubject || user.teacherSubject;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      if ((req as any).user) {
        await logActivity({
          userId: (req as any).user._id.toString(),
          action: "Updated user",
          details: `Updated user with email: ${updatedUser.email}`,
        });

        res.status(200).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          studentClass: updatedUser.studentClass,
          teacherSubject: updatedUser.teacherSubject,
          message: "User updated successfully",
        });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();

      if ((req as any).user) {
        await logActivity({
          userId: (req as any).user._id.toString(),
          action: "Deleted user",
          details: `Deleted user with email: ${user.email}`,
        });
      }

      res.status(200).json({ message: "User delete successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

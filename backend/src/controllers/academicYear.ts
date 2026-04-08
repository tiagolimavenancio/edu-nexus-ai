import { type Request, type Response } from "express";
import AcademicYear from "../models/academicYear";
import { logActivity } from "../utils/activitieslog";

// @desc    Create a new Academic Year
// @route   POST /api/academic-years
// @access  Private/Admin
export const createAcademicYear = async (req: Request, res: Response) => {
  try {
    const { name, fromYear, toYear, isCurrent } = req.body;

    const existingYear = await AcademicYear.findOne({ fromYear, toYear });

    if (existingYear) {
      res.status(400).json({ message: "Academic Year already exists" });
      return;
    }

    // If isCurrent is true, set all other academic years to false
    if (isCurrent) {
      // the issue is here
      await AcademicYear.updateMany({ _id: { $ne: null } }, { isCurrent: false });
      // we should no use return since we want the function to continue
    }

    const academicYear = await AcademicYear.create({
      name,
      fromYear,
      toYear,
      isCurrent: isCurrent || false,
    });

    await logActivity({
      userId: (req as any).user._id,
      action: `Created academic year ${name}`,
    });

    res.status(201).json(academicYear);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

import { type Request, type Response } from "express";
import { inngest } from "../inngest";
import { logActivity } from "../utils/activitieslog";

// @desc    Generate a Timetable using AI
// @route   POST /api/timetables/generate
// @access  Private/Admin
export const generateTimeTable = async (req: Request, res: Response) => {
  try {
    const { classId, academicYearId, settings } = req.body;

    await inngest.send({
      name: "generate/timetable",
      data: {
        classId,
        academicYearId,
        settings,
      },
    });

    const userId = (req as any).user._id;

    await logActivity({
      userId,
      action: `Requested timetable generation for class ID: ${classId}`,
    });

    res.status(200).json({ message: "Timetable generation initiated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getTimeTable = async (req: Request, res: Response) => {};

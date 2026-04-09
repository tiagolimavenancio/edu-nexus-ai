import { inngest } from "./client";

export const generateTimeTable = inngest.createFunction(
  { id: "Generate-Timetable" },
  { event: "generate/timetable" },
  async ({ event, step }) => {
    const { classId, academicYearId, settings } = event.data;
    await step.sleep("wait-a-moment", "1s");
    return { classId, academicYearId, settings };
  },
);

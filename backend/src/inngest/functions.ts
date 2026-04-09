import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import Class from "../models/class.ts";
import User from "../models/user.ts";

interface IGenSettings {
  startTime: string;
  endTime: string;
  periods: number;
}

export const generateTimeTable = inngest.createFunction(
  { id: "Generate-Timetable" },
  { event: "generate/timetable" },
  async ({ event, step }) => {
    const { classId, academicYearId, settings } = event.data as {
      classId: string;
      academicYearId: string;
      settings: IGenSettings;
    };

    const contextData = await step.run("fetch-class-context", async () => {
      const classData = await Class.findById(classId).populate("subjects");
      if (!classData) throw new NonRetriableError("Class not found");

      const allTeacher = await User.find({ role: "teacher" });

      const classSubjectsIds = classData.subjects.map((sub) => sub._id.toString());

      const qualifiedTeachers = allTeacher
        .filter((teacher) => {
          if (!teacher.teacherSubject) return false;

          return teacher.teacherSubject.some((subId) =>
            classSubjectsIds.includes(subId.toString()),
          );
        })
        .map((tea) => ({
          id: tea._id,
          name: tea.name,
          subjects: tea.teacherSubject,
        }));

      const subjectsPayload = classData.subjects.map((sub: any) => ({
        id: sub._id,
        name: sub.name,
        code: sub.code,
      }));

      // here we should check if we have teachers and subjects
      if (subjectsPayload.length === 0 || qualifiedTeachers.length === 0)
        throw new NonRetriableError("No Subjects or Teachers assigned to these class");

      return {
        className: classData.name,
        subjects: subjectsPayload,
        teachers: qualifiedTeachers,
      };
    });

    return { contextData };
  },
);

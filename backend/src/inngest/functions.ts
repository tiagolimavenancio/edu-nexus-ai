import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import Class from "../models/class.ts";
import User from "../models/user.ts";
import Timetable from "../models/timetable.ts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

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

    const aiSchedule = await step.run("generate-timetable-logic", async () => {
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

      if (!apiKey) {
        throw new NonRetriableError("Missing GOOGLE_GENERATIVE_AI_API_KEY");
      }

      const allTimetables = await Timetable.find({
        academicYear: academicYearId,
      });

      const prompt = `
        You are a school scheduler. Generate a weekly timetable (Monday to Friday).

        CONTEXT:
        - Class: ${contextData.className}
        - Hours: ${settings.startTime} to ${settings.endTime} (${settings.periods} periods/day).

        RESOURCES:
        - Subjects: ${JSON.stringify(contextData.subjects)}
        - Teachers: ${JSON.stringify(contextData.teachers)}
        - Other Timetables: ${JSON.stringify(allTimetables)}

        STRICT RULES:
        1. Assign a Teacher to every Subject period.
        2. Teacher MUST have the subject ID in their list.
        3. Break Time/Free Period after every 2 periods(10 minutes), Lunch Time after 5 periods(at 12:00)(30 minutes).
        4. Avoid clashes with other classes(teacher can't be in two classes at the same time).
        5. Output strict JSON only. Schema:
           {
             "schedule": [
               {
                 "day": "Monday",
                 "periods": [
                   { "subject": "SUBJECT_ID", "teacher": "TEACHER_ID", "startTime": "HH:MM", "endTime": "HH:MM" }
                 ]
               }
             ]
           }
      `;

      const google = createGoogleGenerativeAI({ apiKey });
      const activeModel = google("gemini-3-flash-preview");

      const { text } = await generateText({
        prompt,
        model: activeModel,
      });

      const cleanJSON = text.replace(/```json/g, "").replace(/```/g, "");
      return JSON.parse(cleanJSON);
    });

    await step.run("save-timetable", async () => {
      // Delete existing to avoid duplicates
      // we should also delete any timetable assigned or generate for these class
      await Timetable.findOneAndDelete({
        class: classId,
        academicYear: academicYearId,
      });

      await Timetable.create({
        class: classId,
        academicYear: academicYearId,
        schedule: aiSchedule.schedule,
      });

      return { success: true, classId };
    });

    return { message: "Timetable generated successfully" };
  },
);

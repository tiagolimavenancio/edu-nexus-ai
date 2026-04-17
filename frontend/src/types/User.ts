import type { IClass } from "@/types/Class";
import type { ISubject } from "@/types/Subject";

export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  studentClass?: IClass;
  teacherSubjects?: ISubject[];
}

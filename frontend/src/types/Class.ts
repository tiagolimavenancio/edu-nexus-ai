import type { IAcademicYear } from "@/types/AcademicYear";
import type { ISubject } from "@/types/Subject";
import type { IUser } from "@/types/User";

export interface IClass {
  _id: string;
  name: string;
  academicYear: IAcademicYear;
  classTeacher: IUser;
  subjects: ISubject[];
  students: IUser[];
  capacity: number;
}

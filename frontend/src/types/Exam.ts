import type { IClass } from "@/types/Class";
import type { ISubject } from "@/types/Subject";
import type { IUser } from "@/types/User";

export interface IQuestion {
  _id: string;
  questionText: string;
  type: string;
  options: string[]; // Array of strings e.g. ["A", "B", "C", "D"]
  correctAnswer: string; // Hidden from students in default queries
  points: number;
}

export interface IExam {
  _id: string;
  title: string;
  subject: ISubject;
  class: IClass;
  teacher: IUser;
  questions: IQuestion[];
  duration: number; // in minutes
  dueDate: Date;
  isActive: boolean;
}

export interface ISubmission {
  _id: string;
  score: number;
  exam: IExam; // The populated exam with answers
  answers: { questionId: string; answer: string }[];
}

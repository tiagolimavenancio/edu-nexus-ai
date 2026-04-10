export { inngest } from "./client";
import { generateExam, generateTimeTable } from "./functions";

export const functions = [generateTimeTable, generateExam]; // ou importe de functions.ts

import { z } from "zod";

export const examFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  class: z.string().min(1, "Class is required"),
  topic: z.string().min(3, "Topic is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  count: z.coerce.number().min(1).max(20),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;

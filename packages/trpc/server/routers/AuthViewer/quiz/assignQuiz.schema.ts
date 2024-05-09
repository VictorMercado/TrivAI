import { z } from 'zod';


export const ZAssignQuizInput = z.object({
  quizId: z.number(),
  userId: z.string(),
  assigneeId: z.string(),
});

export type TAssignQuizInput = z.infer<typeof ZAssignQuizInput>;
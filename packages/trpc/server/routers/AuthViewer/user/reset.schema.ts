import { z } from 'zod';

export const ZResetQuizAnswersInput = z.object({
  quizId: z.number(),
  userId: z.string(),
});

export type TResetQuizAnswersInput = z.infer<typeof ZResetQuizAnswersInput>;
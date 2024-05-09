import { z } from 'zod';

export const ZCheckAnswers = z.object({
  quizId: z.number(),
  userId: z.string(),
  questionId: z.string(),
  completed: z.boolean(),
  answers: z.array(z.object({
    selectedAnswer: z.string(),
    userId: z.string(),
    selectedId: z.string(),
  })),
});

export type TCheckAnswers = z.infer<typeof ZCheckAnswers>;
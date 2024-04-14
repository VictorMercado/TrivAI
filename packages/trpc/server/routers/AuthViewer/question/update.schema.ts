import { z } from 'zod';

export const ZUpdateQuestionInput = z.object({
  id: z.string(),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  correctAnswer: z.string(),
  text: z.string().optional(),
  image: z.string().optional(),
  quizId: z.number(),
});

export type TUpdateQuestionInput = z.infer<typeof ZUpdateQuestionInput>;
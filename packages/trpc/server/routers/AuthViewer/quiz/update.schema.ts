import { z } from 'zod';

export const ZUpdateQuizInput = z.object({
  id: z.number(),
  ownerId: z.string(),
  dateDue: z.string().optional(),
  public: z.enum(["PUBLIC", "PRIVATE", "FRIENDS"]),
  quizCategoryId: z.number(),
  scoreAmt: z.number().optional(),
  image: z.string().optional(),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string().optional(),
    correctAnswer: z.string(),
    answer1: z.string(),
    answer2: z.string(),
    answer3: z.string(),
    answer4: z.string(),
    image: z.string().optional(),
  })),
});

export type TUpdateQuizInput = z.infer<typeof ZUpdateQuizInput>;
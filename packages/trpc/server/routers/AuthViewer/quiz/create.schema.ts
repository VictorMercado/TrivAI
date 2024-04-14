import { z } from 'zod';

export const ZCreateQuizInput = z.object({
  year: z.number().optional(),
  month: z.number().optional(),
  day: z.number().optional(),
  separateGeneration: z.boolean().optional(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  theme: z.object({
    id: z.number().optional(),
    name: z.string().optional(),
  }).optional(),
  ownerId: z.string(),
  assignId: z.string(),
  scoreAmt: z.number().optional(),
  image: z.string().optional(),
  userDescription: z.string().optional(),
  questionLength: z.number().optional(),

  // image or text
  questionType: z.string().optional(),
});

export type TCreateQuizInput = z.infer<typeof ZCreateQuizInput>;
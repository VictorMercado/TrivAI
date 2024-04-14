import {z } from 'zod';

export const ZDeleteQuizInput = z.object({
  id: z.number(),
  userId: z.string(),
});

export type TDeleteQuizInput = z.infer<typeof ZDeleteQuizInput>;
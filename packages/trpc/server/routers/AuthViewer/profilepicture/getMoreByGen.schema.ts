import { z } from 'zod';

export const ZGetMoreByGen = z.object({
  gen: z.number(),
  skip: z.number(),
  take: z.number(),
});

export type TGetMoreByGen = z.infer<typeof ZGetMoreByGen>;
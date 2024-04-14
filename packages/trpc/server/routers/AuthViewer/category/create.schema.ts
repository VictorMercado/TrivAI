import { z } from 'zod';

export const ZCreateCategoryInput = z.object({
  name: z.string(),
  userId: z.string(),
});

export const ZCreateCategoryOutput = z.object({
  id: z.number(),
  name: z.string(),
});

export type TCreateCategoryInput = z.infer<typeof ZCreateCategoryInput>;
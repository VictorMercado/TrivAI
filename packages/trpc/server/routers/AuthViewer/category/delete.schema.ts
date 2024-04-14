import { z } from 'zod';

export const ZDeleteCategoryInput = z.object({
  id: z.number(),
  userId: z.string(),
});

export type TDeleteCategoryInput = z.infer<typeof ZDeleteCategoryInput>;
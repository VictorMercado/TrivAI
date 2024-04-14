import { z } from 'zod';

export const ZGetCategoryInput = z.object({
  id: z.number(),
});

export type TGetCategoryInput = z.infer<typeof ZGetCategoryInput>;
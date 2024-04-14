import { z } from 'zod';

export const ZGetAllByCategoryInput = z.object({
  categoryId: z.number(),
});

export type TGetAllByCategoryInput = z.infer<typeof ZGetAllByCategoryInput>;
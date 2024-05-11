import { z } from 'zod';

export const ZCreateInput = z.object({
  name: z.string(),
  categoryId: z.number(),
});

export type TCreateInput = z.infer<typeof ZCreateInput>;
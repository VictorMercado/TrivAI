import { z } from 'zod';

export const ZCreateThemeInput = z.object({
  name: z.string(),
  categoryId: z.number(),
});

export type TCreateThemeInput = z.infer<typeof ZCreateThemeInput>;
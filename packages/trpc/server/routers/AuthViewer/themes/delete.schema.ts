import { z } from 'zod';

export const ZDeleteThemeInput = z.object({
  id: z.number(),
  userId: z.string(),
});

export type TDeleteThemeInput = z.infer<typeof ZDeleteThemeInput>;
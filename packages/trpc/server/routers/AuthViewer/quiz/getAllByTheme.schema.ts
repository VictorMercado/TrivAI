import { z } from 'zod';

export const ZGetAllByThemeInput = z.object({
  categoryId: z.number(),
  themeId: z.number(),
});

export type TGetAllByThemeInput = z.infer<typeof ZGetAllByThemeInput>;

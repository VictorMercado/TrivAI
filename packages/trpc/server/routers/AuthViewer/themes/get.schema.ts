import { z } from 'zod';

export const ZGetThemeInput = z.object({
  categoryIds: z.number().array(),
});


export type TGetThemeInput = z.infer<typeof ZGetThemeInput>;
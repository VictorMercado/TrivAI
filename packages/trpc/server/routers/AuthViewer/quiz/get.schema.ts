import { z } from 'zod';

export const ZGetInput = z.object({
  id: z.number(),
});

export type TGetInput = z.infer<typeof ZGetInput>;
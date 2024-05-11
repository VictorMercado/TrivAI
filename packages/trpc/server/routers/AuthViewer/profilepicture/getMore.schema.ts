import { z } from 'zod';

export const ZGetMoreInput = z.object({
  skip: z.number(),
  take: z.number(),
});

export type TGetMoreInput = z.infer<typeof ZGetMoreInput>;
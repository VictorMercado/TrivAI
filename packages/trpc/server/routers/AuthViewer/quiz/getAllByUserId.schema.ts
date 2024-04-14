import { z } from 'zod';

export const ZGetAllByUserIdInput = z.object({
  userId: z.string(),
});

export type TGetAllByUserIdInput = z.infer<typeof ZGetAllByUserIdInput>;
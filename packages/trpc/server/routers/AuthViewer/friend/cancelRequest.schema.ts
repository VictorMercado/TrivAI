import { z } from 'zod';

export const ZCancelRequestInput = z.object({
  userId: z.string(),
  friendId: z.string(),
});

export type TCancelRequestInput = z.infer<typeof ZCancelRequestInput>;
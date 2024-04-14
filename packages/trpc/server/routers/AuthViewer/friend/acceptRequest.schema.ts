import { z } from 'zod';

export const ZAcceptRequestInput = z.object({
  userId: z.string(),
  friendId: z.string(),
});

export type TAcceptRequestInput = z.infer<typeof ZAcceptRequestInput>;
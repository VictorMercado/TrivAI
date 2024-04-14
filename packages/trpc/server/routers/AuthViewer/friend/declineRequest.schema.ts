import { z } from 'zod';

export const ZDeclineRequestInput = z.object({
  userId: z.string(),
  friendId: z.string(),
});

export type TDeclineRequestInput = z.infer<typeof ZDeclineRequestInput>;
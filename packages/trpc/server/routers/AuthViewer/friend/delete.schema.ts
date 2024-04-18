import { z } from 'zod';

export const ZDeleteFriendInput = z.object({
  userId: z.string(),
  friendId: z.string(),
});

export type TDeleteFriendInput = z.infer<typeof ZDeleteFriendInput>;
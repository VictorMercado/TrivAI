import { z } from 'zod';

export const ZCreateFriendInput = z.object({
  userId: z.string(),
  friendUsername: z.string(),
});

export type TCreateFriendInput = z.infer<typeof ZCreateFriendInput>;

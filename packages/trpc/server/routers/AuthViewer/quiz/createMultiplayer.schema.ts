import { z } from 'zod';

export const ZCreateMultiplayerInput = z.object({
  quizId: z.number(),
  // ownerId: z.string(),
  roomId: z.string(),
});

export type TCreateMultiplayerInput = z.infer<typeof ZCreateMultiplayerInput>;
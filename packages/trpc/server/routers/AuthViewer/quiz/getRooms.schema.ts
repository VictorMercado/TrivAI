import { z } from 'zod';

export const ZGetRoomsInput = z.object({
  quizId: z.number(),
});

export type TGetRoomsInput = z.infer<typeof ZGetRoomsInput>;
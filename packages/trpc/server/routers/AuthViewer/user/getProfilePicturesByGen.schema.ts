import { z } from 'zod';

export const ZGetProfilePicturesByGen = z.object({
  gen: z.number(),
  skip: z.number(),
  take: z.number(),
  userId: z.string().optional(),
});

export type TGetProfilePicturesByGen = z.infer<typeof ZGetProfilePicturesByGen>;
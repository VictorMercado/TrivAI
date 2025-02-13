import { z } from 'zod';

export const ZGetProfilePictures = z.object({
  userId: z.string(),
});

export type TGetProfilePictures = z.infer<typeof ZGetProfilePictures>;
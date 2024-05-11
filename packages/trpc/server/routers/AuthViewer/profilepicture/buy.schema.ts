import { z } from "zod";

export const ZBuyInput = z.object({
  userId: z.string(),
  profilePictureId: z.number(), 
});

export type TBuyInput = z.infer<typeof ZBuyInput>;
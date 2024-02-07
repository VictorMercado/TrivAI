import * as z from "zod"

export const FeedbackModel = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  message: z.string(),
  createdAt: z.date(),
})

import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const SharedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
  recipientId: z.string(),
})

export interface CompleteSharedQuiz extends z.infer<typeof SharedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
  recipient: CompleteUser
}

/**
 * RelatedSharedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSharedQuizModel: z.ZodSchema<CompleteSharedQuiz> = z.lazy(() => SharedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
  recipient: RelatedUserModel,
}))

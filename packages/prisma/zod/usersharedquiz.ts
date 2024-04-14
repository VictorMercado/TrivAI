import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const UserSharedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
  recipientId: z.string(),
})

export interface CompleteUserSharedQuiz extends z.infer<typeof UserSharedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
  recipient: CompleteUser
}

/**
 * RelatedUserSharedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserSharedQuizModel: z.ZodSchema<CompleteUserSharedQuiz> = z.lazy(() => UserSharedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
  recipient: RelatedUserModel,
}))

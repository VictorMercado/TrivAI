import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const UserSavedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
})

export interface CompleteUserSavedQuiz extends z.infer<typeof UserSavedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
}

/**
 * RelatedUserSavedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserSavedQuizModel: z.ZodSchema<CompleteUserSavedQuiz> = z.lazy(() => UserSavedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
}))

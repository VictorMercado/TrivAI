import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const UserLikedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
})

export interface CompleteUserLikedQuiz extends z.infer<typeof UserLikedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
}

/**
 * RelatedUserLikedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserLikedQuizModel: z.ZodSchema<CompleteUserLikedQuiz> = z.lazy(() => UserLikedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
}))

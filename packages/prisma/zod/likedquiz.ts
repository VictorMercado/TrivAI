import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const LikedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
})

export interface CompleteLikedQuiz extends z.infer<typeof LikedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
}

/**
 * RelatedLikedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLikedQuizModel: z.ZodSchema<CompleteLikedQuiz> = z.lazy(() => LikedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
}))

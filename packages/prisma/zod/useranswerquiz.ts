import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel, CompleteUserAnswer, RelatedUserAnswerModel } from "./index"

export const UserAnswerQuizModel = z.object({
  id: z.string(),
  completed: z.boolean(),
  time: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
})

export interface CompleteUserAnswerQuiz extends z.infer<typeof UserAnswerQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
  userAnswers: CompleteUserAnswer[]
}

/**
 * RelatedUserAnswerQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserAnswerQuizModel: z.ZodSchema<CompleteUserAnswerQuiz> = z.lazy(() => UserAnswerQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
  userAnswers: RelatedUserAnswerModel.array(),
}))

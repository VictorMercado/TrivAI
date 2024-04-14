import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel, CompleteUserAnswer, RelatedUserAnswerModel } from "./index"

export const UserAnsweredQuizModel = z.object({
  id: z.string(),
  completed: z.boolean(),
  time: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
})

export interface CompleteUserAnsweredQuiz extends z.infer<typeof UserAnsweredQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
  userAnswers: CompleteUserAnswer[]
}

/**
 * RelatedUserAnsweredQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserAnsweredQuizModel: z.ZodSchema<CompleteUserAnsweredQuiz> = z.lazy(() => UserAnsweredQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
  userAnswers: RelatedUserAnswerModel.array(),
}))

import * as z from "zod"
import { CompleteQuestion, RelatedQuestionModel, CompleteUser, RelatedUserModel, CompleteUserAnsweredQuiz, RelatedUserAnsweredQuizModel } from "./index"

export const UserAnswerModel = z.object({
  id: z.string(),
  selectedAnswer: z.string(),
  correctAnswer: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  questionId: z.string(),
  userId: z.string(),
  userAnsweredQuizId: z.string().nullish(),
})

export interface CompleteUserAnswer extends z.infer<typeof UserAnswerModel> {
  question: CompleteQuestion
  user: CompleteUser
  userAnsweredQuiz?: CompleteUserAnsweredQuiz | null
}

/**
 * RelatedUserAnswerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserAnswerModel: z.ZodSchema<CompleteUserAnswer> = z.lazy(() => UserAnswerModel.extend({
  question: RelatedQuestionModel,
  user: RelatedUserModel,
  userAnsweredQuiz: RelatedUserAnsweredQuizModel.nullish(),
}))

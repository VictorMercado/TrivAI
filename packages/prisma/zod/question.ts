import * as z from "zod"
import { CompleteUserAnswer, RelatedUserAnswerModel, CompleteQuiz, RelatedQuizModel } from "./index"

export const QuestionModel = z.object({
  id: z.string(),
  isUsed: z.boolean(),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  answer4: z.string(),
  correctAnswer: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string().nullish(),
  text: z.string().nullish(),
  quizId: z.number().int(),
})

export interface CompleteQuestion extends z.infer<typeof QuestionModel> {
  userAnswers: CompleteUserAnswer[]
  quiz: CompleteQuiz
}

/**
 * RelatedQuestionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQuestionModel: z.ZodSchema<CompleteQuestion> = z.lazy(() => QuestionModel.extend({
  userAnswers: RelatedUserAnswerModel.array(),
  quiz: RelatedQuizModel,
}))

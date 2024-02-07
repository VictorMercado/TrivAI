import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const SavedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
})

export interface CompleteSavedQuiz extends z.infer<typeof SavedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
}

/**
 * RelatedSavedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSavedQuizModel: z.ZodSchema<CompleteSavedQuiz> = z.lazy(() => SavedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
}))

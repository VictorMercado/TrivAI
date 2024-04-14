import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const UserAssignedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  year: z.number().int().nullish(),
  month: z.number().int().nullish(),
  day: z.number().int().nullish(),
  quizId: z.number().int(),
  userId: z.string(),
  assigneeId: z.string(),
})

export interface CompleteUserAssignedQuiz extends z.infer<typeof UserAssignedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
  assignee: CompleteUser
}

/**
 * RelatedUserAssignedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserAssignedQuizModel: z.ZodSchema<CompleteUserAssignedQuiz> = z.lazy(() => UserAssignedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
  assignee: RelatedUserModel,
}))

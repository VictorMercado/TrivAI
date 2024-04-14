import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel } from "./index"

export const AssignedQuizModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  quizId: z.number().int(),
  userId: z.string(),
  assigneeId: z.string(),
})

export interface CompleteAssignedQuiz extends z.infer<typeof AssignedQuizModel> {
  quiz: CompleteQuiz
  user: CompleteUser
  assignee: CompleteUser
}

/**
 * RelatedAssignedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAssignedQuizModel: z.ZodSchema<CompleteAssignedQuiz> = z.lazy(() => AssignedQuizModel.extend({
  quiz: RelatedQuizModel,
  user: RelatedUserModel,
  assignee: RelatedUserModel,
}))

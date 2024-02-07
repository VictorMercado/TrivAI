import * as z from "zod"
import { CompleteWeek, RelatedWeekModel, CompleteQuiz, RelatedQuizModel } from "./index"

export const DayModel = z.object({
  id: z.number().int(),
  day: z.number().int(),
  weekId: z.number().int(),
})

export interface CompleteDay extends z.infer<typeof DayModel> {
  week: CompleteWeek
  quizzes: CompleteQuiz[]
}

/**
 * RelatedDayModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDayModel: z.ZodSchema<CompleteDay> = z.lazy(() => DayModel.extend({
  week: RelatedWeekModel,
  quizzes: RelatedQuizModel.array(),
}))

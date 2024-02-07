import * as z from "zod"
import { CompleteMonth, RelatedMonthModel, CompleteDay, RelatedDayModel } from "./index"

export const WeekModel = z.object({
  id: z.number().int(),
  week: z.number().int(),
  monthId: z.number().int(),
})

export interface CompleteWeek extends z.infer<typeof WeekModel> {
  month: CompleteMonth
  days: CompleteDay[]
}

/**
 * RelatedWeekModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedWeekModel: z.ZodSchema<CompleteWeek> = z.lazy(() => WeekModel.extend({
  month: RelatedMonthModel,
  days: RelatedDayModel.array(),
}))

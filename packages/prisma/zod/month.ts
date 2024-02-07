import * as z from "zod"
import { CompleteYear, RelatedYearModel, CompleteWeek, RelatedWeekModel } from "./index"

export const MonthModel = z.object({
  id: z.number().int(),
  month: z.number().int(),
  yearId: z.number().int(),
})

export interface CompleteMonth extends z.infer<typeof MonthModel> {
  year: CompleteYear
  weeks: CompleteWeek[]
}

/**
 * RelatedMonthModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMonthModel: z.ZodSchema<CompleteMonth> = z.lazy(() => MonthModel.extend({
  year: RelatedYearModel,
  weeks: RelatedWeekModel.array(),
}))

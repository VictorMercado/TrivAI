import * as z from "zod"
import { CompleteMonth, RelatedMonthModel } from "./index"

export const YearModel = z.object({
  id: z.number().int(),
  year: z.number().int(),
})

export interface CompleteYear extends z.infer<typeof YearModel> {
  months: CompleteMonth[]
}

/**
 * RelatedYearModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedYearModel: z.ZodSchema<CompleteYear> = z.lazy(() => YearModel.extend({
  months: RelatedMonthModel.array(),
}))

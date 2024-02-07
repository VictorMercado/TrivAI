import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteAllegiance, RelatedAllegianceModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const AllegianceQuizModel = z.object({
  id: z.number().int(),
  score: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  assignedTo: z.number().int().nullish(),
  quizId: z.number().int(),
  allegianceId: z.number().int(),
  categoryId: z.number().int(),
})

export interface CompleteAllegianceQuiz extends z.infer<typeof AllegianceQuizModel> {
  quiz: CompleteQuiz
  allegiance: CompleteAllegiance
  category: CompleteCategory
}

/**
 * RelatedAllegianceQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllegianceQuizModel: z.ZodSchema<CompleteAllegianceQuiz> = z.lazy(() => AllegianceQuizModel.extend({
  quiz: RelatedQuizModel,
  allegiance: RelatedAllegianceModel,
  category: RelatedCategoryModel,
}))

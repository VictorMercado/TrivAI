import * as z from "zod"
import { CompleteQuizCategory, RelatedQuizCategoryModel, CompleteCategory, RelatedCategoryModel, CompleteAllegianceMember, RelatedAllegianceMemberModel, CompleteAllegianceQuiz, RelatedAllegianceQuizModel } from "./index"

export const AllegianceModel = z.object({
  id: z.string(),
  leaderId: z.string(),
  name: z.string(),
  image: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteAllegiance extends z.infer<typeof AllegianceModel> {
  quizCategories: CompleteQuizCategory[]
  categories: CompleteCategory[]
  members: CompleteAllegianceMember[]
  quizzes: CompleteAllegianceQuiz[]
}

/**
 * RelatedAllegianceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllegianceModel: z.ZodSchema<CompleteAllegiance> = z.lazy(() => AllegianceModel.extend({
  quizCategories: RelatedQuizCategoryModel.array(),
  categories: RelatedCategoryModel.array(),
  members: RelatedAllegianceMemberModel.array(),
  quizzes: RelatedAllegianceQuizModel.array(),
}))

import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteAllegiance, RelatedAllegianceModel, CompleteQuizCategory, RelatedQuizCategoryModel, CompleteTheme, RelatedThemeModel, CompleteAllegianceQuiz, RelatedAllegianceQuizModel } from "./index"

export const CategoryModel = z.object({
  id: z.number().int(),
  name: z.string(),
  daysLength: z.number().int(),
  quizLength: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  userId: z.string().nullish(),
  allegianceId: z.string().nullish(),
})

export interface CompleteCategory extends z.infer<typeof CategoryModel> {
  user?: CompleteUser | null
  allegiance?: CompleteAllegiance | null
  quizCategory: CompleteQuizCategory[]
  theme: CompleteTheme[]
  allegianceQuiz: CompleteAllegianceQuiz[]
}

/**
 * RelatedCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategoryModel: z.ZodSchema<CompleteCategory> = z.lazy(() => CategoryModel.extend({
  user: RelatedUserModel.nullish(),
  allegiance: RelatedAllegianceModel.nullish(),
  quizCategory: RelatedQuizCategoryModel.array(),
  theme: RelatedThemeModel.array(),
  allegianceQuiz: RelatedAllegianceQuizModel.array(),
}))

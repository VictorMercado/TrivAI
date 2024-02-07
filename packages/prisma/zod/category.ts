import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteQuizCategory, RelatedQuizCategoryModel, CompleteKeywordPrompt, RelatedKeywordPromptModel, CompleteAllegianceQuiz, RelatedAllegianceQuizModel } from "./index"

export const CategoryModel = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  userId: z.string().nullish(),
})

export interface CompleteCategory extends z.infer<typeof CategoryModel> {
  user?: CompleteUser | null
  quizCategory?: CompleteQuizCategory | null
  keywordPrompt: CompleteKeywordPrompt[]
  allegianceQuiz: CompleteAllegianceQuiz[]
}

/**
 * RelatedCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategoryModel: z.ZodSchema<CompleteCategory> = z.lazy(() => CategoryModel.extend({
  user: RelatedUserModel.nullish(),
  quizCategory: RelatedQuizCategoryModel.nullish(),
  keywordPrompt: RelatedKeywordPromptModel.array(),
  allegianceQuiz: RelatedAllegianceQuizModel.array(),
}))

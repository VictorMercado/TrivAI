import * as z from "zod"
import { CompleteQuizCategory, RelatedQuizCategoryModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const KeywordPromptModel = z.object({
  id: z.number().int(),
  keyword: z.string(),
  daysLength: z.number().int(),
  quizLength: z.number().int(),
  isUsed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categoryId: z.number().int(),
})

export interface CompleteKeywordPrompt extends z.infer<typeof KeywordPromptModel> {
  QuizCategory: CompleteQuizCategory[]
  category: CompleteCategory
}

/**
 * RelatedKeywordPromptModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedKeywordPromptModel: z.ZodSchema<CompleteKeywordPrompt> = z.lazy(() => KeywordPromptModel.extend({
  QuizCategory: RelatedQuizCategoryModel.array(),
  category: RelatedCategoryModel,
}))

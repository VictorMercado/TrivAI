import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteKeywordPrompt, RelatedKeywordPromptModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const QuizCategoryModel = z.object({
  id: z.number().int(),
  basePrompt: z.string(),
  sdPrompt: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean(),
  image: z.string().nullish(),
  keywordPromptId: z.number().int().nullish(),
  categoryId: z.number().int(),
})

export interface CompleteQuizCategory extends z.infer<typeof QuizCategoryModel> {
  quizzes: CompleteQuiz[]
  keywordPrompt?: CompleteKeywordPrompt | null
  category: CompleteCategory
}

/**
 * RelatedQuizCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQuizCategoryModel: z.ZodSchema<CompleteQuizCategory> = z.lazy(() => QuizCategoryModel.extend({
  quizzes: RelatedQuizModel.array(),
  keywordPrompt: RelatedKeywordPromptModel.nullish(),
  category: RelatedCategoryModel,
}))

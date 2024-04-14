import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel, CompleteUser, RelatedUserModel, CompleteAllegiance, RelatedAllegianceModel, CompleteTheme, RelatedThemeModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const QuizCategoryModel = z.object({
  id: z.number().int(),
  basePrompt: z.string(),
  sdPrompt: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullish(),
  allegianceId: z.string().nullish(),
  themeId: z.number().int().nullish(),
  categoryId: z.number().int(),
})

export interface CompleteQuizCategory extends z.infer<typeof QuizCategoryModel> {
  quizzes: CompleteQuiz[]
  user?: CompleteUser | null
  allegiance?: CompleteAllegiance | null
  theme?: CompleteTheme | null
  category: CompleteCategory
}

/**
 * RelatedQuizCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQuizCategoryModel: z.ZodSchema<CompleteQuizCategory> = z.lazy(() => QuizCategoryModel.extend({
  quizzes: RelatedQuizModel.array(),
  user: RelatedUserModel.nullish(),
  allegiance: RelatedAllegianceModel.nullish(),
  theme: RelatedThemeModel.nullish(),
  category: RelatedCategoryModel,
}))

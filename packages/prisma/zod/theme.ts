import * as z from "zod"
import { CompleteQuizCategory, RelatedQuizCategoryModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const ThemeModel = z.object({
  id: z.number().int(),
  name: z.string(),
  daysLength: z.number().int(),
  quizLength: z.number().int(),
  isUsed: z.boolean(),
  beginDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categoryId: z.number().int(),
})

export interface CompleteTheme extends z.infer<typeof ThemeModel> {
  QuizCategory: CompleteQuizCategory[]
  category: CompleteCategory
}

/**
 * RelatedThemeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedThemeModel: z.ZodSchema<CompleteTheme> = z.lazy(() => ThemeModel.extend({
  QuizCategory: RelatedQuizCategoryModel.array(),
  category: RelatedCategoryModel,
}))

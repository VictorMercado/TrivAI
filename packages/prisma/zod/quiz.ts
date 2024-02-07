import * as z from "zod"
import { CompleteQuestion, RelatedQuestionModel, CompleteUserAnswerQuiz, RelatedUserAnswerQuizModel, CompleteAllegianceQuiz, RelatedAllegianceQuizModel, CompleteLikedQuiz, RelatedLikedQuizModel, CompleteSharedQuiz, RelatedSharedQuizModel, CompleteSavedQuiz, RelatedSavedQuizModel, CompleteUser, RelatedUserModel, CompleteDay, RelatedDayModel, CompleteQuizCategory, RelatedQuizCategoryModel } from "./index"

export const QuizModel = z.object({
  id: z.number().int(),
  scoreAmt: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  dateDue: z.date(),
  likes: z.number().int(),
  shares: z.number().int(),
  completions: z.number().int(),
  saves: z.number().int(),
  image: z.string().nullish(),
  ownerId: z.string().nullish(),
  dayId: z.number().int().nullish(),
  quizCategoryId: z.number().int(),
})

export interface CompleteQuiz extends z.infer<typeof QuizModel> {
  questions: CompleteQuestion[]
  userAnswers: CompleteUserAnswerQuiz[]
  allegianceQuiz?: CompleteAllegianceQuiz | null
  likedQuiz: CompleteLikedQuiz[]
  sharedQuiz: CompleteSharedQuiz[]
  savedQuiz: CompleteSavedQuiz[]
  owner?: CompleteUser | null
  day?: CompleteDay | null
  quizCategory: CompleteQuizCategory
}

/**
 * RelatedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQuizModel: z.ZodSchema<CompleteQuiz> = z.lazy(() => QuizModel.extend({
  questions: RelatedQuestionModel.array(),
  userAnswers: RelatedUserAnswerQuizModel.array(),
  allegianceQuiz: RelatedAllegianceQuizModel.nullish(),
  likedQuiz: RelatedLikedQuizModel.array(),
  sharedQuiz: RelatedSharedQuizModel.array(),
  savedQuiz: RelatedSavedQuizModel.array(),
  owner: RelatedUserModel.nullish(),
  day: RelatedDayModel.nullish(),
  quizCategory: RelatedQuizCategoryModel,
}))

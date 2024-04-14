import * as z from "zod"
import { QuizAccess, GeneratedStatus } from "@prisma/client"
import { CompleteQuestion, RelatedQuestionModel, CompleteUserAnsweredQuiz, RelatedUserAnsweredQuizModel, CompleteAllegianceQuiz, RelatedAllegianceQuizModel, CompleteUserAssignedQuiz, RelatedUserAssignedQuizModel, CompleteUserLikedQuiz, RelatedUserLikedQuizModel, CompleteUserSharedQuiz, RelatedUserSharedQuizModel, CompleteUserSavedQuiz, RelatedUserSavedQuizModel, CompleteUser, RelatedUserModel, CompleteQuizCategory, RelatedQuizCategoryModel } from "./index"

export const QuizModel = z.object({
  id: z.number().int(),
  scoreAmt: z.number().int(),
  public: z.nativeEnum(QuizAccess),
  dateDue: z.date().nullish(),
  likes: z.number().int(),
  shares: z.number().int(),
  completions: z.number().int(),
  saves: z.number().int(),
  image: z.string().nullish(),
  genStatus: z.nativeEnum(GeneratedStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string().nullish(),
  quizCategoryId: z.number().int(),
})

export interface CompleteQuiz extends z.infer<typeof QuizModel> {
  questions: CompleteQuestion[]
  userAnswers: CompleteUserAnsweredQuiz[]
  allegianceQuiz?: CompleteAllegianceQuiz | null
  assignedQuiz: CompleteUserAssignedQuiz[]
  likedQuiz: CompleteUserLikedQuiz[]
  sharedQuiz: CompleteUserSharedQuiz[]
  savedQuiz: CompleteUserSavedQuiz[]
  owner?: CompleteUser | null
  quizCategory: CompleteQuizCategory
}

/**
 * RelatedQuizModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQuizModel: z.ZodSchema<CompleteQuiz> = z.lazy(() => QuizModel.extend({
  questions: RelatedQuestionModel.array(),
  userAnswers: RelatedUserAnsweredQuizModel.array(),
  allegianceQuiz: RelatedAllegianceQuizModel.nullish(),
  assignedQuiz: RelatedUserAssignedQuizModel.array(),
  likedQuiz: RelatedUserLikedQuizModel.array(),
  sharedQuiz: RelatedUserSharedQuizModel.array(),
  savedQuiz: RelatedUserSavedQuizModel.array(),
  owner: RelatedUserModel.nullish(),
  quizCategory: RelatedQuizCategoryModel,
}))

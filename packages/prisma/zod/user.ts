import * as z from "zod"
import { Role } from "@prisma/client"
import { CompleteAccount, RelatedAccountModel, CompleteSession, RelatedSessionModel, CompleteCategory, RelatedCategoryModel, CompleteUserAnswer, RelatedUserAnswerModel, CompleteUserAnswerQuiz, RelatedUserAnswerQuizModel, CompleteAllegianceMember, RelatedAllegianceMemberModel, CompleteItemUser, RelatedItemUserModel, CompleteProfilePictureUser, RelatedProfilePictureUserModel, CompleteQuiz, RelatedQuizModel, CompleteLikedQuiz, RelatedLikedQuizModel, CompleteSavedQuiz, RelatedSavedQuizModel, CompleteSharedQuiz, RelatedSharedQuizModel, CompleteUserFriend, RelatedUserFriendModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  userName: z.string().nullish(),
  name: z.string().nullish(),
  primaryColor: z.string().nullish(),
  secondaryColor: z.string().nullish(),
  credits: z.number().int(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  prize: z.string().nullish(),
  role: z.nativeEnum(Role),
  cheatUsed: z.boolean(),
  cheatUsedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  totalScore: z.number().int(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  categories: CompleteCategory[]
  userAnswers: CompleteUserAnswer[]
  userAnswerQuiz: CompleteUserAnswerQuiz[]
  allegiance?: CompleteAllegianceMember | null
  collection: CompleteItemUser[]
  profilePictures: CompleteProfilePictureUser[]
  quizzes: CompleteQuiz[]
  likedQuizzes: CompleteLikedQuiz[]
  savedQuizzes: CompleteSavedQuiz[]
  sharedQuizzes: CompleteSharedQuiz[]
  assignedQuizzes: CompleteSharedQuiz[]
  friends: CompleteUserFriend[]
  friendOf: CompleteUserFriend[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  accounts: RelatedAccountModel.array(),
  sessions: RelatedSessionModel.array(),
  categories: RelatedCategoryModel.array(),
  userAnswers: RelatedUserAnswerModel.array(),
  userAnswerQuiz: RelatedUserAnswerQuizModel.array(),
  allegiance: RelatedAllegianceMemberModel.nullish(),
  collection: RelatedItemUserModel.array(),
  profilePictures: RelatedProfilePictureUserModel.array(),
  quizzes: RelatedQuizModel.array(),
  likedQuizzes: RelatedLikedQuizModel.array(),
  savedQuizzes: RelatedSavedQuizModel.array(),
  sharedQuizzes: RelatedSharedQuizModel.array(),
  assignedQuizzes: RelatedSharedQuizModel.array(),
  friends: RelatedUserFriendModel.array(),
  friendOf: RelatedUserFriendModel.array(),
}))

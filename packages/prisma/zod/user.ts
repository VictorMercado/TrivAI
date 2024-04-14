import * as z from "zod"
import { Role } from "@prisma/client"
import { CompleteAccount, RelatedAccountModel, CompleteSession, RelatedSessionModel, CompleteUserProfilePicture, RelatedUserProfilePictureModel, CompleteAllegianceMember, RelatedAllegianceMemberModel, CompleteUserItem, RelatedUserItemModel, CompleteQuizCategory, RelatedQuizCategoryModel, CompleteCategory, RelatedCategoryModel, CompleteUserAnswer, RelatedUserAnswerModel, CompleteUserAnsweredQuiz, RelatedUserAnsweredQuizModel, CompleteQuiz, RelatedQuizModel, CompleteUserAssignedQuiz, RelatedUserAssignedQuizModel, CompleteUserLikedQuiz, RelatedUserLikedQuizModel, CompleteUserSavedQuiz, RelatedUserSavedQuizModel, CompleteUserSharedQuiz, RelatedUserSharedQuizModel, CompleteUserFriend, RelatedUserFriendModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  userName: z.string().nullish(),
  name: z.string().nullish(),
  primaryColor: z.string().nullish(),
  secondaryColor: z.string().nullish(),
  credits: z.number().int(),
  creditsMultiplier: z.number(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  prize: z.string().nullish(),
  status: z.string().nullish(),
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
  profilePictures: CompleteUserProfilePicture[]
  allegiance?: CompleteAllegianceMember | null
  collection: CompleteUserItem[]
  quizCategories: CompleteQuizCategory[]
  categories: CompleteCategory[]
  userAnswers: CompleteUserAnswer[]
  userAnsweredQuizzes: CompleteUserAnsweredQuiz[]
  ownedQuizzes: CompleteQuiz[]
  assignedQuizzes: CompleteUserAssignedQuiz[]
  assignedToMeQuizzes: CompleteUserAssignedQuiz[]
  likedQuizzes: CompleteUserLikedQuiz[]
  savedQuizzes: CompleteUserSavedQuiz[]
  sharedQuizzes: CompleteUserSharedQuiz[]
  sharedWithQuizzes: CompleteUserSharedQuiz[]
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
  profilePictures: RelatedUserProfilePictureModel.array(),
  allegiance: RelatedAllegianceMemberModel.nullish(),
  collection: RelatedUserItemModel.array(),
  quizCategories: RelatedQuizCategoryModel.array(),
  categories: RelatedCategoryModel.array(),
  userAnswers: RelatedUserAnswerModel.array(),
  userAnsweredQuizzes: RelatedUserAnsweredQuizModel.array(),
  ownedQuizzes: RelatedQuizModel.array(),
  assignedQuizzes: RelatedUserAssignedQuizModel.array(),
  assignedToMeQuizzes: RelatedUserAssignedQuizModel.array(),
  likedQuizzes: RelatedUserLikedQuizModel.array(),
  savedQuizzes: RelatedUserSavedQuizModel.array(),
  sharedQuizzes: RelatedUserSharedQuizModel.array(),
  sharedWithQuizzes: RelatedUserSharedQuizModel.array(),
  friends: RelatedUserFriendModel.array(),
  friendOf: RelatedUserFriendModel.array(),
}))

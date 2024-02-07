import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const UserFriendModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  friendId: z.string(),
})

export interface CompleteUserFriend extends z.infer<typeof UserFriendModel> {
  user: CompleteUser
  friend: CompleteUser
}

/**
 * RelatedUserFriendModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserFriendModel: z.ZodSchema<CompleteUserFriend> = z.lazy(() => UserFriendModel.extend({
  user: RelatedUserModel,
  friend: RelatedUserModel,
}))

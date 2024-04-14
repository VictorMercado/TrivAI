import * as z from "zod"
import { CompleteProfilePicture, RelatedProfilePictureModel, CompleteUser, RelatedUserModel } from "./index"

export const UserProfilePictureModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profilePictureId: z.number().int(),
  userId: z.string(),
})

export interface CompleteUserProfilePicture extends z.infer<typeof UserProfilePictureModel> {
  profilePicture: CompleteProfilePicture
  user: CompleteUser
}

/**
 * RelatedUserProfilePictureModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserProfilePictureModel: z.ZodSchema<CompleteUserProfilePicture> = z.lazy(() => UserProfilePictureModel.extend({
  profilePicture: RelatedProfilePictureModel,
  user: RelatedUserModel,
}))

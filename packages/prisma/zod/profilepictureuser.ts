import * as z from "zod"
import { CompleteProfilePicture, RelatedProfilePictureModel, CompleteUser, RelatedUserModel } from "./index"

export const ProfilePictureUserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profilePictureId: z.number().int(),
  userId: z.string(),
})

export interface CompleteProfilePictureUser extends z.infer<typeof ProfilePictureUserModel> {
  profilePicture: CompleteProfilePicture
  user: CompleteUser
}

/**
 * RelatedProfilePictureUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProfilePictureUserModel: z.ZodSchema<CompleteProfilePictureUser> = z.lazy(() => ProfilePictureUserModel.extend({
  profilePicture: RelatedProfilePictureModel,
  user: RelatedUserModel,
}))

import * as z from "zod"
import { CompleteProfilePictureUser, RelatedProfilePictureUserModel } from "./index"

export const ProfilePictureModel = z.object({
  id: z.number().int(),
  name: z.string(),
  gen: z.number().int(),
  shiny: z.boolean(),
  mega: z.boolean(),
  legendary: z.boolean(),
  createdAt: z.date(),
  cost: z.number().int(),
  image: z.string(),
})

export interface CompleteProfilePicture extends z.infer<typeof ProfilePictureModel> {
  profilePictures: CompleteProfilePictureUser[]
}

/**
 * RelatedProfilePictureModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProfilePictureModel: z.ZodSchema<CompleteProfilePicture> = z.lazy(() => ProfilePictureModel.extend({
  profilePictures: RelatedProfilePictureUserModel.array(),
}))

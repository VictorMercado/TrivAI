import * as z from "zod"
import { CompleteItem, RelatedItemModel, CompleteUser, RelatedUserModel } from "./index"

export const ItemUserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  itemId: z.number().int(),
  userId: z.string(),
})

export interface CompleteItemUser extends z.infer<typeof ItemUserModel> {
  item: CompleteItem
  user: CompleteUser
}

/**
 * RelatedItemUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedItemUserModel: z.ZodSchema<CompleteItemUser> = z.lazy(() => ItemUserModel.extend({
  item: RelatedItemModel,
  user: RelatedUserModel,
}))

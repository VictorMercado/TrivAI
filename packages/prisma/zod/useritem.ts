import * as z from "zod"
import { CompleteItem, RelatedItemModel, CompleteUser, RelatedUserModel } from "./index"

export const UserItemModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  itemId: z.number().int(),
  userId: z.string(),
})

export interface CompleteUserItem extends z.infer<typeof UserItemModel> {
  item: CompleteItem
  user: CompleteUser
}

/**
 * RelatedUserItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserItemModel: z.ZodSchema<CompleteUserItem> = z.lazy(() => UserItemModel.extend({
  item: RelatedItemModel,
  user: RelatedUserModel,
}))

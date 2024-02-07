import * as z from "zod"
import { CompleteItemUser, RelatedItemUserModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const ItemModel = z.object({
  id: z.number().int(),
  name: z.string(),
  numId: z.number().int().nullish(),
  data: jsonSchema,
  cost: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string(),
})

export interface CompleteItem extends z.infer<typeof ItemModel> {
  users: CompleteItemUser[]
}

/**
 * RelatedItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedItemModel: z.ZodSchema<CompleteItem> = z.lazy(() => ItemModel.extend({
  users: RelatedItemUserModel.array(),
}))

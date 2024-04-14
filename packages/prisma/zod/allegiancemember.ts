import * as z from "zod"
import { AllegianceRole } from "@prisma/client"
import { CompleteUser, RelatedUserModel, CompleteAllegiance, RelatedAllegianceModel } from "./index"

export const AllegianceMemberModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  allegianceRole: z.nativeEnum(AllegianceRole),
  userId: z.string(),
  allegianceId: z.string(),
})

export interface CompleteAllegianceMember extends z.infer<typeof AllegianceMemberModel> {
  user: CompleteUser
  allegiance: CompleteAllegiance
}

/**
 * RelatedAllegianceMemberModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAllegianceMemberModel: z.ZodSchema<CompleteAllegianceMember> = z.lazy(() => AllegianceMemberModel.extend({
  user: RelatedUserModel,
  allegiance: RelatedAllegianceModel,
}))

import * as z from "zod"
import { CompleteQuiz, RelatedQuizModel } from "./index"

export const RoomModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  roomId: z.string(),
  quizId: z.number().int(),
})

export interface CompleteRoom extends z.infer<typeof RoomModel> {
  quiz: CompleteQuiz
}

/**
 * RelatedRoomModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoomModel: z.ZodSchema<CompleteRoom> = z.lazy(() => RoomModel.extend({
  quiz: RelatedQuizModel,
}))

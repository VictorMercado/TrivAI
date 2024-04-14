import { router, protectedProcedure } from "@trivai/trpc/server/trpc";
import { update } from "./update.handler";
import { ZUpdateQuestionInput } from "./update.schema";

export const questionRouter = router({
  update: protectedProcedure.input(ZUpdateQuestionInput).mutation(async ({ctx, input}) => {
    return await update({ctx, input});
  }),
  
});
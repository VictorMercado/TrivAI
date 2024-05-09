import { router, protectedProcedure } from "@trivai/trpc/server/trpc";
import { update } from "./update.handler";
import { ZUpdateQuestionInput } from "./update.schema";
import { checkAnswers } from "./checkAnswers.handler";
import { ZCheckAnswers } from "./checkAnswers.schema";

export const questionRouter = router({
  update: protectedProcedure.input(ZUpdateQuestionInput).mutation(async ({ctx, input}) => {
    return await update({ctx, input});
  }),
  checkAnswers: protectedProcedure.input(ZCheckAnswers).mutation(async ({ctx, input}) => {
    return await checkAnswers({ctx, input});
  }),
});
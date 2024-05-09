import { protectedProcedure, router } from "@trivai/trpc/server/trpc";
import { getAssignedSelfQuzzies } from "./getAssignedSelfQuzzies.handler"; 
import { getUserToFriendAssignedQuizzes } from "./getUserToFriendAssignedQuizzes.handler";
import { getFriendToUserAssignedQuizzes } from "./getFriendToUserAssignedQuizzes.handler";
import { resetQuizAnswers } from "./reset.handler";
import { ZResetQuizAnswersInput } from "./reset.schema";

export const userRouter = router({
  getAssignedSelfQuzzies: protectedProcedure.query(async ({ ctx, input }) => {
    return await getAssignedSelfQuzzies({ ctx, input });
  }),
  getUserToFriendAssignedQuizzes: protectedProcedure.query(async ({ ctx, input }) => {
    return await getUserToFriendAssignedQuizzes({ ctx, input });
  }),
  getFriendToUserAssignedQuizzes: protectedProcedure.query(async ({ ctx, input }) => {
    return await getFriendToUserAssignedQuizzes({ ctx, input });
  }),
  resetQuizAnswers: protectedProcedure.input(ZResetQuizAnswersInput).mutation(async ({ input, ctx }) => {
    return await resetQuizAnswers({ input, ctx });
  }),
});
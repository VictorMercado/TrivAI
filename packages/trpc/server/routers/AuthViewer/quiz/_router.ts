import { protectedProcedure, router } from "@trivai/trpc/server/trpc";
import { getAllByUserId } from "./getAllByUserId.handler";
import { ZGetAllByUserIdInput } from "./getAllByUserId.schema";
import { getAllByCategory } from "./getAllByCategory.handler";
import { ZGetAllByCategoryInput } from "./getAllByCategory.schema";
import { getAllByTheme } from "./getAllByTheme.handler";
import { ZGetAllByThemeInput } from "./getAllByTheme.schema";
import { get } from "./get.handler";
import { ZGetInput } from "./get.schema";
import { create } from "./create.handler";
import { ZCreateQuizInput } from "./create.schema";
import { update } from "./update.handler";
import { ZUpdateQuizInput } from "./update.schema";
import { deleteQuiz } from "./delete.handler";
import { ZDeleteQuizInput } from "./delete.schema";

export const quizRouter = router({
  getAllByUserId: protectedProcedure.input(ZGetAllByUserIdInput).query(async ({ ctx, input }) => {
    return await getAllByUserId({ ctx, input });
  }),
  getAllByCategory: protectedProcedure.input(ZGetAllByCategoryInput).query(async ({ ctx, input }) => {
    return await getAllByCategory({ ctx, input });
  }),
  getAllByTheme: protectedProcedure.input(ZGetAllByThemeInput).query(async ({ ctx, input }) => {
    return await getAllByTheme({ ctx, input });
  }),
  get: protectedProcedure.input(ZGetInput).query(async ({ input, ctx }) => {
    return await get({ input, ctx });
  }),
  create: protectedProcedure.input(ZCreateQuizInput).mutation(async ({ input, ctx }) => {
    return await create({ input, ctx });
  }),
  update: protectedProcedure.input(ZUpdateQuizInput).mutation(async ({ input, ctx }) => {
    return await update({ input, ctx });
  }),
  delete: protectedProcedure.input(ZDeleteQuizInput).mutation(async ({ input, ctx }) => {
    return await deleteQuiz({ input, ctx});
  }),
});

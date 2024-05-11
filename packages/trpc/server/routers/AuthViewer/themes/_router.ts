import { router, protectedProcedure } from '@trivai/trpc/server/trpc';
import { get } from './get.handler';
import { ZGetThemeInput } from './get.schema';
import { create } from './create.handler';
import { ZCreateInput } from './create.schema';
import { deleteTheme } from './delete.handler';
import { ZDeleteThemeInput } from './delete.schema';

export const themeRouter = router({
  get: protectedProcedure.input(ZGetThemeInput).query(async ({ ctx, input }) => {
    return await get({ ctx, input });
  }),
  create: protectedProcedure.input(ZCreateInput).mutation(async ({ ctx, input }) => {
    return await create({ ctx, input });
  }),
  delete: protectedProcedure.input(ZDeleteThemeInput).mutation(async ({ ctx, input }) => {
    return await deleteTheme({ ctx, input });
  }),
});
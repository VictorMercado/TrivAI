import { router, publicProcedure,protectedProcedure } from '../../../trpc';
import { TCreateCategoryInput, ZCreateCategoryInput } from './create.schema';
import { create } from './create.handler';
import { get } from './get.handler';
import { TGetCategoryInput, ZGetCategoryInput } from './get.schema';
import { getAll } from './getAll.handler';
import { TGetAllCategoryInput } from './getAll.schema';
import { deleteCategory } from './delete.handler';
import { ZDeleteCategoryInput } from './delete.schema';

export const categoryRouter = router({
  create: protectedProcedure.input(ZCreateCategoryInput).mutation(async ({ input, ctx }) => {
    return await create({ ctx, input });
  }),
  get: protectedProcedure.input(ZGetCategoryInput).query(async ({ input, ctx }) => {
    return await get({ ctx, input });
  }),
  getAll: protectedProcedure.query(async ({ ctx, }) => {
    return await getAll({ ctx, });
  }),
  delete: protectedProcedure.input(ZDeleteCategoryInput).mutation(async ({ input, ctx }) => {
    return await deleteCategory({ ctx, input });
  }),
});
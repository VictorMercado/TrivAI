import { Context } from "@trivai/trpc/server/context";
import { TGetCategoryInput } from './get.schema';

type GetCategoryOptions = {
  ctx: Context;
  input: TGetCategoryInput;
};

export const get = async ({ ctx, input }: GetCategoryOptions) => {
  const { prisma } = ctx; 
  return await prisma.category.findFirst({
    where: {
      id: input.id,
    },
  });
};
import { Context } from "@trivai/trpc/server/context";
import { TGetThemeInput } from './get.schema';

type GetThemesOptions = {
  ctx: Context;
  input: TGetThemeInput;
};
export const get = async ({ctx, input} : GetThemesOptions) => {
  const { prisma } = ctx;
  return await prisma.theme.findMany({
    where: {
      categoryId: {in: input.categoryIds},
    },
    select: {
      id: true,
      name: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

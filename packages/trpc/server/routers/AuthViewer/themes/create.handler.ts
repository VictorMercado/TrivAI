import { TCreateInput } from './create.schema';
import { Context } from "@trivai/trpc/server/context";

type ThemeOptions = {
  ctx: Context;
  input: TCreateInput;
};

export const create = async ({ ctx, input }: ThemeOptions) => {
  const { prisma } = ctx;
  let theme;
  try {
    theme = await prisma.theme.create({
      data: {
        name: input.name,
        categoryId: input.categoryId,
      },
    });
  } catch (e) {
    console.error(e);
  }
  return theme;
};
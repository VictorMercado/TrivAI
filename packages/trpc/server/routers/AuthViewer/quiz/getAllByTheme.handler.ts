import { Context } from '@trivai/trpc/server/context';
import { TGetAllByThemeInput } from './getAllByTheme.schema';
import { PrismaQuizSelectView } from '@trivai/lib/server/queries/quiz';

type GetAllByThemeOptions = {
  ctx: Context;
  input: TGetAllByThemeInput;
};

export const getAllByTheme = async ({ ctx, input }: GetAllByThemeOptions) => {
  const { prisma } = ctx;
  const quizCategory = await prisma.quizCategory.findFirst({
    where: {
      categoryId: input.categoryId,
      themeId: input.themeId,
    },
    select: {
      quizzes: {
        select: PrismaQuizSelectView
      },
    },
  });
  return quizCategory?.quizzes ?? [];
};

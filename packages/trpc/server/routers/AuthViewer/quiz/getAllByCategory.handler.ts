import { Context } from "@trivai/trpc/server/context";
import { TGetAllByCategoryInput } from './getAllByCategory.schema';
import { PrismaQuizSelectView } from "@trivai/lib/server/queries/quiz"

type GetAllByCategoryOptions = {
  ctx: Context;
  input: TGetAllByCategoryInput;
};

export const getAllByCategory = async ({ ctx, input }: GetAllByCategoryOptions) => {
  const { prisma } = ctx;
  const quizCategory = await prisma.quizCategory.findFirst({
    where: {
      categoryId: input.categoryId,
      AND: {
        themeId: null
      }
    },
    select: {
      quizzes: {
        select: PrismaQuizSelectView
      }
    }
  });
  return quizCategory?.quizzes ?? [];
}
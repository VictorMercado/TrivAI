import { Context } from "@trivai/trpc/server/context";
import { TGetInput } from './get.schema';
import { PrismaQuizSelectView } from "@trivai/lib/server/queries/quiz";

type Options = {
  ctx: Context;
  input: TGetInput;
};

export const get = async ({ ctx, input }: Options) => {
  const { prisma } = ctx;
  return await prisma.quiz.findFirst({
    where: {
      id: input.id,
    },
    select: PrismaQuizSelectView,
  });
};

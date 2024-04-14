import { Context } from "@trivai/trpc/server/context";
import { TDeleteQuizInput } from "./delete.schema";

type GetQuizOptions = {
  ctx: Context;
  input: TDeleteQuizInput;
};

export const deleteQuiz = async ({ ctx, input }: GetQuizOptions) => {
  const { prisma, session } = ctx;
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!quiz) throw new Error('Quiz not found');
  if (quiz.ownerId !== session!.user.id) throw new Error('Unauthorized');
  return await prisma.quiz.delete({
    where: {
      id: input.id,
    },
  });
};

import { Context } from "@trivai/trpc/server/context";
import { TCreateMultiplayerInput } from "../quiz/createMultiplayer.schema";
import { TRPCError } from "@trivai/trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { type TResetQuizAnswersInput } from "./reset.schema";

type TResetQuizAnswersOptions = {
  ctx: Context;
  input: TResetQuizAnswersInput;
};

export const resetQuizAnswers = async ({ ctx, input }: TResetQuizAnswersOptions) => {
  const { prisma, session } = ctx;
  if (!session || !session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to reset a quiz",
    });
  }
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: input.quizId,
    },
  });
  if (!quiz) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Quiz not found",
    });
  }
  if (input.userId !== session.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You can only reset your own quiz answers",
    });
  }
  let resetQuizId;
  try {
    resetQuizId = await prisma.userAnsweredQuiz.findFirst({
      where: {
        quizId: input.quizId,
        userId: input.userId
      },
      select: {
        id: true
      }
    });
  } catch (e) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: getPrismaErrorDescription(e),
    });
  }

  let resetQuiz;
  try {
    resetQuiz = await prisma.userAnsweredQuiz.delete({
      where: {
        id: resetQuizId?.id
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: getPrismaErrorDescription(e),
    });
  }
  return resetQuiz;
}
import { Context } from "@trivai/trpc/server/context";
import { TCreateMultiplayerInput } from "./createMultiplayer.schema";
import { TRPCError } from "@trivai/trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";

type CreateMultiplayerOptions = {
  ctx: Context;
  input: TCreateMultiplayerInput;
};

export const createMultiplayer = async ({ ctx, input }: CreateMultiplayerOptions) => {
  const { prisma, session } = ctx;
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to create a multiplayer quiz",
    });
  }
  // const quiz = await prisma.quiz.findUnique({
  //   where: {
  //     id: input.quizId,
  //   },
  // });
  // if (!quiz) {
  //   throw new TRPCError({
  //     code: "NOT_FOUND",
  //     message: "Quiz not found",
  //   });
  // }
  // if (quiz.ownerId !== session.user.id) {
  //   throw new TRPCError({
  //     code: "UNAUTHORIZED",
  //     message: "You must be the owner of the quiz to create a multiplayer quiz",
  //   });
  // }
  let multiplayerQuiz;
  try {
    multiplayerQuiz = await prisma.room.create({
      data: {
        roomId: input.roomId,
        quizId: input.quizId,
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: getPrismaErrorDescription(e),
    });
  }
  return multiplayerQuiz;
};
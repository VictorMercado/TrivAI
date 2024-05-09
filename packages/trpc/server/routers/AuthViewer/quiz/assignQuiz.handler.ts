import { Context } from "@trivai/trpc/server/context";
import { ZodError } from "zod";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TAssignQuizInput } from "./assignQuiz.schema";
import { TRPCError } from "@trpc/server";

type AssignQuizHandlerProps = {
  ctx: Context;
  input: TAssignQuizInput;
};

export const assignQuiz = async ({ ctx, input }: AssignQuizHandlerProps) => {
  const { prisma, session } = ctx;
  const { quizId, userId, assigneeId } = input;

  if (session!.user.id !== userId) {
    throw new Error("Unauthorized");
  }
  let checkIfExist;
  try {
    checkIfExist = await prisma.userAssignedQuiz.findFirst({
      where: {
        quizId,
        assigneeId,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(error),
    });
  }
  if (checkIfExist) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Quiz already assigned to this user",
    });
  }
  try {
    await prisma.userAssignedQuiz.create({
      data: {
        userId,
        quizId,
        assigneeId,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(error),
    });
  }
};
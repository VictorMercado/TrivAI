import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { 
  getUserAssignedQuizzesForPresentation, 
  getUsersAnsweredQuizzesWithAnswers, 
  getUserAnsweredQuizzes,
  type TQuizzesView 
} from "@trivai/lib/server/queries/quiz";
import {
  mergeQuizzesView,
} from "@trivai/lib/server/queries/quiz/helpers";

type GetAssignedSelfQuizzesOptions = {
  ctx: Context;
  input: any;
};

export const getAssignedSelfQuzzies = async ({ ctx, input }: GetAssignedSelfQuizzesOptions) => {
  const { prisma, session } = ctx;
  let userAssignedQuizzes;
  let userAssignedQuizIds;
  let userQuizzes;
  if (!session || !session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to view your quizzes",
    });
  }
  try {
    userAssignedQuizzes = await getUserAssignedQuizzesForPresentation(session.user.id);
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  }
  userAssignedQuizzes = userAssignedQuizzes.map((quiz) => quiz.quiz);
  userAssignedQuizIds = userAssignedQuizzes.map((quiz) => quiz.id);
  try {
    // userQuizzes = await getUsersAnsweredQuizzesWithAnswers(
    //   session.user?.id,
    //   userAssignedQuizIds,
    // );
    userQuizzes = await getUserAnsweredQuizzes(session.user?.id, userAssignedQuizIds);
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  }

  const quizzes = mergeQuizzesView(
    userAssignedQuizzes,
    userQuizzes,
  ) as TQuizzesView;
  
  return quizzes.reverse();
};
import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";
import {
  getFriendAssignedQuizzesToUser,
  getUserAnsweredQuizzes,
  getUserAssignedQuizzesForPresentation,
  getUsersAnsweredQuizzesWithAnswers,
  type TQuizzesView
} from "@trivai/lib/server/queries/quiz";
import {
  mergeQuizzesView,
} from "@trivai/lib/server/queries/quiz/helpers";

type GetFriendToUserAssignedQuizzesOptions = {
  ctx: Context;
  input: any;
};

export const getFriendToUserAssignedQuizzes = async ({ ctx, input }: GetFriendToUserAssignedQuizzesOptions) => {
  const { prisma, session } = ctx;
  if (!session || !session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to view your quizzes",
    });
  }
  let friendAssignedQuizzes;
  let friendAssignedQuizzesIds: Array<number>;
  let friendQuizzes;
  let FriendToUserQuizzesDisplay;

  try {
    friendAssignedQuizzes = await getFriendAssignedQuizzesToUser(session.user.id);
    friendAssignedQuizzes = friendAssignedQuizzes.map((quiz) => quiz.quiz);
    friendAssignedQuizzesIds = friendAssignedQuizzes.map((quiz) => quiz.id);
    friendQuizzes = await getUserAnsweredQuizzes(
      session.user?.id,
      friendAssignedQuizzesIds,
    );
    FriendToUserQuizzesDisplay = mergeQuizzesView(
      friendAssignedQuizzes,
      friendQuizzes,
    ) as TQuizzesView;
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  } 

  return FriendToUserQuizzesDisplay.reverse();
};
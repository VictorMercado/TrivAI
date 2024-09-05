import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";
import {
  getUserAnsweredQuiz,
  getUserAssignedQuizzesToFriends,
  TQuizzesView,
} from "@trivai/lib/server/queries/quiz";
import {
  mergeQuizzesByQuizIdAndAssigneeId,
} from "@trivai/lib/server/queries/quiz/helpers";

type GetUserToFriendAssignedQuizzesOptions = {
  ctx: Context;
  input: any;
};

export const getUserToFriendAssignedQuizzes = async ({ ctx, input }: GetUserToFriendAssignedQuizzesOptions) => {
  const { prisma, session } = ctx;
  if (!session || !session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to view your quizzes",
    });
  }
  let userToFriendQuizzesDisplay;
  let userAssignedToFriendsQuizzes;
  let userAssignedToFriendsQuizzesIds: Array<{
    quizId: number;
    assigneeId: string;
  }>;

  try {
    userAssignedToFriendsQuizzes = await getUserAssignedQuizzesToFriends(session.user.id);
    userAssignedToFriendsQuizzesIds = userAssignedToFriendsQuizzes.map((quiz) => {
      return { quizId: quiz.quiz.id, assigneeId: quiz.assigneeId };
    });
    const userAssignedToFriendsAnsweredQuizzes = await Promise.all(
      userAssignedToFriendsQuizzesIds.map(async (userToFriend) => {
        let res = await getUserAnsweredQuiz(
          userToFriend.assigneeId,
          userToFriend.quizId,
        );
        return { ...res, assigneeId: userToFriend.assigneeId };
      }),
    );
    userToFriendQuizzesDisplay = mergeQuizzesByQuizIdAndAssigneeId(
      userAssignedToFriendsQuizzes,
      userAssignedToFriendsAnsweredQuizzes as any,
    ) as TQuizzesView;
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  }

  return userToFriendQuizzesDisplay.reverse();
};
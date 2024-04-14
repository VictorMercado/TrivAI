import Link from "next/link";
const routes = ["Pokemon", "Movies", "Games", "Geography", "Cars"];
import { getDueDate } from "@trivai/lib/utils";
import {
  getUserAIAssignedQuizzesForPresentation,
  getUsersAnsweredQuizzesWithAnswers,
  getUserAnsweredQuizzes,
  getUserAnsweredQuiz,
  getUserAssignedQuizzesForPresentation,
  getPublicAIAssignedQuizzesForPresentation,
  getUserAssignedQuizzesToFriends,
  getFriendAssignedQuizzesToUser,
  type TQuizzesView,
} from "@trivai/lib/server/queries/quiz";
import {
  getQuizIdsHelper,
  mergeQuizzesByQuizIdAndAssigneeId,
  mergeQuizzesView,
} from "@trivai/lib/server/queries/quiz/helpers";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { notFound } from "next/navigation";
import { Button } from "@ui/button";
import { ArrowDown, Plus, SlidersHorizontal } from "lucide-react";
import { QuizCard } from "@/src/components/ui/quiz-card";
import { HorizontalScroll } from "@ui/horizontal-scroll";

export default async function QuizPage() {
  const user = await getCurrentUser();
  let quizzesToDisplay: TQuizzesView = [];
  let userAssignedQuizzes;
  let userAssignedQuizIds: Array<number>;
  let userAssignedToFriendsQuizzes;
  let userAssignedToFriendsQuizzesIds: Array<{
    quizId: number;
    assigneeId: string;
  }>;
  let friendAssignedQuizzes;
  let friendAssignedQuizzesIds: Array<number>;

  if (!user) {
    userAssignedQuizzes = await getPublicAIAssignedQuizzesForPresentation();
    return (
      <main className="container grid grid-cols-1 justify-center gap-y-4 p-4">
        <div className="flex flex-col gap-y-12">
          <div className="space-y-2">
            <h1 className="flex items-center gap-x-4 text-3xl">
              AI Quizzes
              <ArrowDown className="h-4 w-4 text-primary" />
            </h1>
            <HorizontalScroll>
              {
                // JSON.stringify(quizzesToDisplay, null, 2)
                userAssignedQuizzes.length > 0 ? (
                  userAssignedQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))
                ) : (
                  <p className="coolText"> Horray your free </p>
                )
              }
            </HorizontalScroll>
          </div>
        </div>
      </main>
    );
  }
  friendAssignedQuizzes = await getFriendAssignedQuizzesToUser(user.id);
  friendAssignedQuizzes = friendAssignedQuizzes.map((quiz) => quiz.quiz);
  friendAssignedQuizzesIds = friendAssignedQuizzes.map((quiz) => quiz.id);
  const friendQuizzes = await getUserAnsweredQuizzes(
    user?.id,
    friendAssignedQuizzesIds,
  );
  const FriendToUserQuizzesDisplay = mergeQuizzesView(
    friendAssignedQuizzes,
    friendQuizzes,
  ) as TQuizzesView;

  userAssignedToFriendsQuizzes = await getUserAssignedQuizzesToFriends(user.id);
  // console.log("Logging started");

  // console.log(userAssignedToFriendsQuizzes);
  // console.log("Logging ended");

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
  const userToFriendQuizzesDisplay = mergeQuizzesByQuizIdAndAssigneeId(
    userAssignedToFriendsQuizzes,
    userAssignedToFriendsAnsweredQuizzes as any,
  );

  // userAssignedToFriendsQuizzes = userAssignedToFriendsQuizzes.map(
  //   (quiz) => quiz.quiz,
  // );

  // console.log(friendAssignedQuizzes);
  userAssignedQuizzes = await getUserAssignedQuizzesForPresentation(user.id);
  userAssignedQuizzes = userAssignedQuizzes.map((quiz) => quiz.quiz);
  userAssignedQuizIds = userAssignedQuizzes.map((quiz) => quiz.id);

  const userQuizzes = await getUsersAnsweredQuizzesWithAnswers(
    user?.id,
    userAssignedQuizIds,
  );
  quizzesToDisplay = mergeQuizzesView(
    userAssignedQuizzes,
    userQuizzes,
  ) as TQuizzesView;

  return (
    <main className="container grid grid-cols-1 justify-center gap-y-4 p-4">
      <div className="flex justify-between text-primary">
        {/* <SlidersHorizontal /> */}
        <Link href="/quizzes/dashboard">
          <Button variant="default" size="default">
            <Plus className="h-4 w-6" />
            Dashboard
          </Button>
        </Link>
        <Button variant="default" size="default">
          <SlidersHorizontal className="h-4 w-6" />
          Filter
        </Button>
      </div>
      <div className="flex flex-col gap-y-12">
        <div className="space-y-2">
          <h1 className="flex items-center gap-x-4 text-3xl">
            Assigned yourself
            <ArrowDown className="h-4 w-4 text-primary" />
          </h1>
          <HorizontalScroll>
            {
              // JSON.stringify(quizzesToDisplay, null, 2)
              quizzesToDisplay.length > 0 ? (
                quizzesToDisplay.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))
              ) : (
                <p className="coolText"> Horray your free </p>
              )
            }
          </HorizontalScroll>
        </div>
        <div className="space-y-2">
          <h1 className="flex items-center gap-x-4 text-3xl">
            Assigned To Friends
            <ArrowDown className="h-4 w-4 text-primary" />
          </h1>
          <HorizontalScroll>
            {userToFriendQuizzesDisplay &&
            userToFriendQuizzesDisplay.length > 0 ? (
              userToFriendQuizzesDisplay.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))
            ) : (
              <p className="coolText"> Horray your free </p>
            )}
          </HorizontalScroll>
        </div>
        <div className="space-y-2">
          <h1 className="flex items-center gap-x-4 text-3xl">
            Assigned by Friends
            <ArrowDown className="h-4 w-4 text-primary" />
          </h1>
          <HorizontalScroll>
            {FriendToUserQuizzesDisplay &&
            FriendToUserQuizzesDisplay.length > 0 ? (
              FriendToUserQuizzesDisplay.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))
            ) : (
              <p className="coolText"> Horray your free </p>
            )}
          </HorizontalScroll>
        </div>
      </div>
      {/* <Button variant="default" size="default">Results</Button> */}
    </main>
  );
}

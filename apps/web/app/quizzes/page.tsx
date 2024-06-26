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
import { ArrowDown, Plus } from "lucide-react";
import { QuizCard } from "@/src/components/ui/quiz-card";
import { HorizontalScroll } from "@ui/horizontal-scroll";
import { AssignedSelfQuizzes } from "./AssignedSelfQuizzes";
import {UserToFriendQuizzes } from "./UserToFriendQuizzes";
import { FriendToUserQuizzes } from "./FriendToUserQuizzes";
import { serverRouter } from "../_trpc/serverRouter";

export default async function QuizPage() {
  const routerApi = await serverRouter();
  const user = await getCurrentUser();
  let quizzesToDisplay : TQuizzesView;
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
                  <p className="coolText"> Horray no quizzes left </p>
                )
              }
            </HorizontalScroll>
          </div>
        </div>
      </main>
    );
  }
  // friendAssignedQuizzes = await getFriendAssignedQuizzesToUser(user.id);
  // friendAssignedQuizzes = friendAssignedQuizzes.map((quiz) => quiz.quiz);
  // friendAssignedQuizzesIds = friendAssignedQuizzes.map((quiz) => quiz.id);
  // const friendQuizzes = await getUserAnsweredQuizzes(
  //   user?.id,
  //   friendAssignedQuizzesIds,
  // );
  // const FriendToUserQuizzesDisplay = mergeQuizzesView(
  //   friendAssignedQuizzes,
  //   friendQuizzes,
  // ) as TQuizzesView;
  const FriendToUserQuizzesDisplay = await routerApi.authViewer.user.getFriendToUserAssignedQuizzes();
  // userAssignedToFriendsQuizzes = await getUserAssignedQuizzesToFriends(user.id);
  // // console.log("Logging started");

  // // console.log(userAssignedToFriendsQuizzes);
  // // console.log("Logging ended");

  // userAssignedToFriendsQuizzesIds = userAssignedToFriendsQuizzes.map((quiz) => {
  //   return { quizId: quiz.quiz.id, assigneeId: quiz.assigneeId };
  // });
  // const userAssignedToFriendsAnsweredQuizzes = await Promise.all(
  //   userAssignedToFriendsQuizzesIds.map(async (userToFriend) => {
  //     let res = await getUserAnsweredQuiz(
  //       userToFriend.assigneeId,
  //       userToFriend.quizId,
  //     );
  //     return { ...res, assigneeId: userToFriend.assigneeId };
  //   }),
  // );
  // const userToFriendQuizzesDisplay = mergeQuizzesByQuizIdAndAssigneeId(
  //   userAssignedToFriendsQuizzes,
  //   userAssignedToFriendsAnsweredQuizzes as any,
  // );
  const userToFriendQuizzesDisplay =
    await routerApi.authViewer.user.getUserToFriendAssignedQuizzes();

  // userAssignedToFriendsQuizzes = userAssignedToFriendsQuizzes.map(
  //   (quiz) => quiz.quiz,
  // );

  // console.log(friendAssignedQuizzes);
  // userAssignedQuizzes = await getUserAssignedQuizzesForPresentation(user.id);
  // userAssignedQuizzes = userAssignedQuizzes.map((quiz) => quiz.quiz);
  // userAssignedQuizIds = userAssignedQuizzes.map((quiz) => quiz.id);

  // const userQuizzes = await getUsersAnsweredQuizzesWithAnswers(
  //   user?.id,
  //   userAssignedQuizIds,
  // );
  // quizzesToDisplay = mergeQuizzesView(
  //   userAssignedQuizzes,
  //   userQuizzes,
  // ) as TQuizzesView;
  quizzesToDisplay = await routerApi.authViewer.user.getAssignedSelfQuzzies();

  return (
    <main className="container grid grid-cols-1 justify-center gap-y-4 p-4">
      <div className="flex justify-between text-primary">
        {/* <SlidersHorizontal /> */}
        <Link href="/quizzes/dashboard">
          <Button variant="default" size="default">
            <Plus className="h-4 w-6" />
            Generate Quizzes
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-y-12">
        <AssignedSelfQuizzes quizzes={quizzesToDisplay} />
        {/* <div className="space-y-2">
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
                <p className="coolText"> Horray no quizzes left </p>
              )
            }
          </HorizontalScroll>
        </div> */}
        {/* <div className="space-y-2">
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
              <p className="coolText"> No quizzes assigned to Friends </p>
            )}
          </HorizontalScroll>
        </div> */}
        <UserToFriendQuizzes quizzes={userToFriendQuizzesDisplay} />

        {/* <div className="space-y-2">
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
              <p className="coolText"> Horray no quizzes left </p>
            )}
          </HorizontalScroll>
        </div> */}
        <FriendToUserQuizzes quizzes={FriendToUserQuizzesDisplay} />
      </div>
      {/* <Button variant="default" size="default">Results</Button> */}
    </main>
  );
}

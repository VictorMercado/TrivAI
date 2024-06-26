import { Inter } from "next/font/google";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import {
  getUserAnsweredQuizzes,
  type TUserAnsweredQuizzesWithoutAnswers,
  getUserAssignedQuizzesForPresentation,
  getAllUsersQuizzes,
  getUsersAnsweredQuizzesWithAnswers,
  getPublicAIAssignedQuizzesForPresentation,
  getUserAIAssignedQuizzesForPresentation,
  type TQuizzesView,
  type TQuizView,
} from "@trivai/lib/server/queries/quiz";
import {
  getQuizIdsHelper,
  mergeQuizzesView,
} from "@trivai/lib/server/queries/quiz/helpers";
import { Leaderboard } from "@components/LeaderBoard";
import Link from "next/link";
import { Button } from "@ui/button";
import { QuizCard } from "@ui/quiz-card";
import { ArrowDown, ArrowRight, Scroll } from "lucide-react";
// import { ColorPicker } from "@/src/components/ColorPicker";
import { AllUsersQuizzes } from "@components/AllUsersQuizzes";

const inter = Inter({ subsets: ["latin"] });


export default async function RootPage() {
  const user = await getCurrentUser();
  let data = await getAllUsersQuizzes();
  let data2 = data.map((result) => result.ownedQuizzes);
  let allUsersQuizzes = data2.flat();
  let sortedQuizzesByDate = allUsersQuizzes.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  let result;
  let quizzesToDisplay: TQuizzesView = [];
  let quizzesToDisplayForUser: TQuizView[] = [];
  if (!user) {
    try {
      quizzesToDisplay = await getPublicAIAssignedQuizzesForPresentation() as TQuizzesView;
    } catch (e) {
      console.error(e);
    }
    return (
      <main className="container grid grid-cols-1 justify-center">
        <div className="flex flex-col gap-y-12 p-6">
          <div className="w-full space-y-2">
            <AllUsersQuizzes quizzes={sortedQuizzesByDate} />
            <h1 className="flex items-center gap-x-4 text-3xl">
              AI Assigned You
              <ArrowDown className="h-4 w-4 text-primary" />
            </h1>
            <div className="hideScroll hideScroll2 flex gap-x-4 overflow-x-auto py-4">
              {
                // JSON.stringify(quizzesToDisplay, null, 2)
                quizzesToDisplay.length > 0 ? (
                  quizzesToDisplay.map((quiz) => (
                    <div
                      className="min-w-[24rem] lg:min-w-[44rem]"
                      key={quiz.id}
                    >
                      <QuizCard quiz={quiz} />
                    </div>
                  ))
                ) : (
                  <div className="flex h-44 w-full items-center justify-center">
                    <p className="coolText"> Horray no quizzes left </p>
                  </div>
                )
              }
            </div>
          </div>
          <Leaderboard />
          <p className="ml-6 mt-6">Want to join the fun? Sign in!</p>
        </div>
      </main>
    );
  }
  try {
    result = await getUserAIAssignedQuizzesForPresentation(user?.id);
    result = result.map((result) => result.quiz);

    const quizIds = getQuizIdsHelper(result);
    const userQuizzes = await getUsersAnsweredQuizzesWithAnswers(
      user?.id,
      quizIds,
    );
    quizzesToDisplayForUser = mergeQuizzesView(result, userQuizzes);
  } catch (e) {
    console.error(e);
  }
  return (
    <main className="container grid grid-cols-1 justify-center">
      <div className="flex flex-col gap-y-12 p-6">
        <div className="w-full space-y-2">
          <AllUsersQuizzes quizzes={sortedQuizzesByDate} />
          <h1 className="flex items-center gap-x-4 text-3xl">
            AI Assigned You
            <ArrowDown className="h-4 w-4 text-primary" />
          </h1>
          <div className="hideScroll hideScroll2 flex gap-x-4 overflow-x-auto py-4">
            {
              // JSON.stringify(quizzesToDisplay, null, 2)
              quizzesToDisplayForUser.length > 0 ? (
                quizzesToDisplayForUser.map((quiz) => (
                  <div className="min-w-[24rem] lg:min-w-[44rem]" key={quiz.id}>
                    <QuizCard quiz={quiz} />
                  </div>
                ))
              ) : (
                <div className="flex h-44 w-full items-center justify-center">
                  <p className="coolText"> Horray no quizzes left </p>
                </div>
              )
            }
          </div>
        </div>
        <div className="flex items-center gap-x-6">
          <p>View yours/friend assigned quizzes here</p>
          <ArrowRight className="h-4 w-4 text-primary" />
          <Link href="/quizzes">
            <Button variant="default" size="default">
              <Scroll className="mr-2 h-6 w-6" />
              Quizzes
            </Button>
          </Link>
        </div>
        <Leaderboard />
        <p className="ml-6">Want to join the fun? Sign in!</p>
      </div>
    </main>
  );
}

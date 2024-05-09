import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { notFound } from "next/navigation";
import { ClientUser } from "./ClientUser";
import {
  getUserAssignedQuizzesForPresentation,
  getUsersAnsweredQuizzesWithAnswers,
  getUserAnsweredQuizzesWithAnswers,
  getQuizzes,
  getFriendAssignedQuizzesToUser,
} from "@trivai/lib/server/queries/quiz";
import { getQuizIdsHelper, mergeQuizzesWithAnswers } from "@trivai/lib/server/queries/quiz/helpers";
import { Suspense } from "react";
import { LoadingCalendar } from "./_components/LoadingCalendar";
import type { TUserAnsweredQuizzesWithAnswers } from "@trivai/lib/server/queries/quiz";

const CurvedLine = () => {
  return (
    <svg width="200" height="200">
      <path
        d="M10,100 Q100,10 190,100"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};


export type UserAssignedQuizzes = Prisma.PromiseReturnType<
  typeof getUserAssignedQuizzesForPresentation
>;


export default async function ResultsPage({params, searchParams}: {params: string; searchParams: string}) {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }
  
  let userAnsweredQuizzes = await getUserAnsweredQuizzesWithAnswers(user.id);
  let userAnsweredQuizzesIds = userAnsweredQuizzes.map((quiz) => quiz.quizId);
  let theAnsweredQuizzes = await getQuizzes(userAnsweredQuizzesIds);
  let moreData = mergeQuizzesWithAnswers(theAnsweredQuizzes, userAnsweredQuizzes);

  let results: UserAssignedQuizzes | undefined;

  results = await getUserAssignedQuizzesForPresentation(user?.id);

  let quizzes = results?.map((result) => result.quiz);
  let quizIds = [];
  for (let i = 0; i<quizzes.length; i++) {
    if (!userAnsweredQuizzesIds.includes(quizzes[i].id)) {
      quizIds.push(quizzes[i].id);
    }
  }
  quizzes = quizzes.filter((quiz) => !userAnsweredQuizzesIds.includes(quiz.id));
  const userQuizzes: TUserAnsweredQuizzesWithAnswers =
    await getUsersAnsweredQuizzesWithAnswers(user?.id, quizIds);

  const mergedQuizzes = mergeQuizzesWithAnswers(quizzes, userQuizzes);
  const doneQuizzes = [...mergedQuizzes, ...moreData].reverse();
  return (
    <main id="main" className="h-fit">
      {user ? (
        // <Suspense fallback={}>
        //   {/* turn component into composition component that way u can pass year data, month data and day data quizzes */}

        // </Suspense>
        <ClientUser initQuizzes={doneQuizzes} />
      ) : (
        <h1 className="text-center text-3xl">Not Allowed</h1>
      )}
    </main>
  );
}

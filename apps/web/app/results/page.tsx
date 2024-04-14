import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { notFound } from "next/navigation";
import { ClientUser } from "./ClientUser";
import {
  getUserAssignedQuizzesForPresentation,
  getUsersAnsweredQuizzesWithAnswers,
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


export default async function ResultsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }
  const date = new Date();
  // when ready to deploy remove the:   1 ||
  const year = date.getFullYear();
  const month = 1 || date.getMonth();
  const day = 1 || date.getDate();

  let results: UserAssignedQuizzes | undefined;

  results = await getUserAssignedQuizzesForPresentation(user?.id);

  const quizzes = results?.map((result) => result.quiz);
  const quizIds = getQuizIdsHelper(quizzes);
  const userQuizzes: TUserAnsweredQuizzesWithAnswers =
    await getUsersAnsweredQuizzesWithAnswers(user?.id, quizIds);

  const mergedQuizzes = mergeQuizzesWithAnswers(quizzes, userQuizzes);

  return (
    <main id="main" className="h-fit">
      {user ? (
        <Suspense fallback={<LoadingCalendar />}>
          {/* turn component into composition component that way u can pass year data, month data and day data quizzes */}
          <ClientUser initQuizzes={mergedQuizzes} />
        </Suspense>
      ) : (
        <h1 className="text-center text-3xl">Not Allowed</h1>
      )}
    </main>
  );
}

import { db } from "@src/db";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@src/session";
import { notFound } from "next/navigation";
import { ClientUser } from "./ClientUser";
import { getTodayQuizzes, getUsersAnswerQuizzes } from "@src/db/queries";
import { getQuizIdsHelper } from "@src/db/helpers";
import { Suspense } from "react";
import { mergeQuizzes } from "@/src/db/helpers";
import { LoadingCalendar } from "./_components/LoadingCalendar";

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

export type UserQuizzes = Prisma.PromiseReturnType<
  typeof getUsersAnswerQuizzes
>;
export type TodayQuizzes = Prisma.PromiseReturnType<typeof getTodayQuizzes>;

// TODO pull this type out of TodayQuizzes

export type AssignedQuizzes =
  | {
      id: number;
      scoreAmt: number;
      quizCategory: {
        image: string | null;
        keywordPrompt: {
          keyword: string;
        } | null;
        category: {
          name: string;
        };
      };
    }[]
  | undefined;

export default async function ResultsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }
  const date = new Date();
  // when ready to deploy remove the:   1 || 
  const year = date.getFullYear();
  const month = 1 || date.getMonth();
  const week = 1 || Math.floor(date.getDate() / 7) + 1;
  const day = 1 || date.getDate();

  let results : TodayQuizzes | undefined;
  // try {
  //   results = await getTodayQuizzes(
  //     date.getFullYear(),
  //     date.getMonth() - 1,
  //     Math.floor(date.getDate() / 7) + 1,
  //     date.getDate(),
  //   );
  //   console.log(results);
    
  // }
  // catch (error) {
  //   console.log(error);
  //   console.log("stuff going on");
    
  // }

  results = await getTodayQuizzes(year, month, week, day);

  const quizzes: AssignedQuizzes = results?.months[0].weeks[0].days[0].quizzes;
  const quizIds = getQuizIdsHelper(quizzes);
  const userQuizzes : UserQuizzes = await getUsersAnswerQuizzes(user?.id, quizIds);

  const mergedQuizzes = mergeQuizzes(
    quizzes,
    userQuizzes,
  );

  return (
    <main id="main" className="h-fit">
      {user ? (
        <Suspense fallback={<LoadingCalendar />}>
          {/* turn component into composition component that why u can pass year data, month data and day data quizzes */}
          <ClientUser initQuizzes={mergedQuizzes}/>
        </Suspense>
      ) : (
        <h1 className="text-center text-3xl">Not Allowed</h1>
      )}
    </main>
  );
}

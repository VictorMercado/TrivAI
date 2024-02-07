import Link from "next/link";
import { prisma } from "@trivai/prisma";
import Image from "next/image";
const routes = ["Pokemon", "Movies", "Games", "Geography", "Cars"];
import { PresentCategories } from "@components/PresentCategories";
import { getDueDate } from "@src/utils";
import { getTodayQuizzes, getUsersAnswerQuizzes } from "@src/db/queries";
import { getQuizIdsHelper, mergeQuizzes } from "@src/db/helpers";
import { getCurrentUser } from "@src/session";
import { notFound } from "next/navigation";
import { Button } from "@ui/button";
import { Plus, SlidersHorizontal } from "lucide-react";

export default async function QuizPage() {
  console.log(getDueDate());
  const user = await getCurrentUser();
  // if (!user) {
  //   return notFound();
  // }
  const result = await getTodayQuizzes(new Date().getFullYear(), 1, 1, 1);
  const quizzes = result?.months[0].weeks[0].days[0].quizzes;
  const quizIds = getQuizIdsHelper(quizzes);
  const userQuizzes = await getUsersAnswerQuizzes(user?.id, quizIds);
  const finishedQuizzes = mergeQuizzes(quizzes, userQuizzes);

  return (
    <main className="">
      {/* <h1 className="text-2xl text-center font-bold">CHOOSE A QUIZ </h1> */}
      {/* <pre>
          {JSON.stringify(quizzes?.months[0].weeks[0].days[0].quizzes, null, 2)}
        </pre> */}
      <div className="flex flex-row">
        <div className="text-primary">
          {/* <SlidersHorizontal /> */}
          <div>
            <Link href="/quizzes/generate">
              <Button variant="default" size="default">
                <Plus className="h-4 w-6" />
                Generate
              </Button>
            </Link>
          </div>
        </div>
        <PresentCategories quizzes={finishedQuizzes} />
      </div>
      {/* <Button variant="default" size="default">Results</Button> */}
    </main>
  );
}

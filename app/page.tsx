import { Inter } from "next/font/google";
import { getCurrentUser } from "@/src/session";
import { getTodayQuizzes, getUsersAnswerQuizzes } from "@/src/db/queries";
import { getQuizIdsHelper, mergeQuizzes } from "@/src/db/helpers";
import { PresentCategories } from "@components/PresentCategories";
import { CoolHeader } from "@components/CoolHeader";
import { Leaderboard } from "@components/LeaderBoard";

// import { ColorPicker } from "@/src/components/ColorPicker";

const inter = Inter({ subsets: ["latin"] });

export default async function RootPage() {
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
    <main className="grid grid-cols-1 justify-center">
      <CoolHeader routeLabel="Live Quizzes" />
      <div className="flex flex-col gap-y-12 p-6">
        <PresentCategories quizzes={finishedQuizzes} />
        {/* @ts-expect-error Server Component */}
        <Leaderboard />
        {/* <div className='flex justify-center'>
          <ColorPicker label="Primary" colorTheme="--color-primary" />
        </div> */}
        <p className="ml-6 mt-6">Want to join the fun? Sign in!</p>
      </div>
    </main>
  );
}

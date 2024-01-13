import Link from "next/link";
import { db } from "@src/db";
import Image from "next/image";
const routes = ["Pokemon", "Movies", "Games", "Geography", "Cars"];
import { PresentCategories } from "@components/PresentCategories";
import { getDueDate } from "@src/utils";
import { getTodayQuizzes, getUsersAnswerQuizzes } from "@src/db/queries";
import { getQuizIdsHelper, mergeQuizzes } from "@src/db/helpers";
import { getCurrentUser } from "@src/session";
import { notFound } from "next/navigation";
import { Button } from "@ui/button";
// import { SVGFilter } from "@ui/SVG";

const SVGFilter = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="style=linear">
        <g id="filter-rectangle">
          <path
            id="vector"
            d="M2 17.5H7"
            stroke="rgb(var(--color-primary))"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            id="vector_2"
            d="M22 6.5H17"
            stroke="rgb(var(--color-primary))"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            id="vector_3"
            d="M13 17.5H22"
            stroke="rgb(var(--color-primary))"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            id="vector_4"
            d="M11 6.5H2"
            stroke="rgb(var(--color-primary))"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            id="rec"
            d="M 7 15 H 13 V 21 H 7 Z"
            stroke="rgb(var(--color-primary))"
            strokeWidth="1.5"
          />
          <path
            id="rec_2"
            d="M 17 4 H 11 V 10 H 17 Z"
            stroke="rgb(var(--color-primary))"
            strokeWidth="1.5"
          />
        </g>
      </g>
    </svg>
  );
};

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
      <div>
        <ul>
          <li>Categories</li>
          <li>Themes</li>
          <li>Friends</li>
        </ul>
      </div>
      <div className="flex flex-row">
        <div>
          <SVGFilter size={32} className="" />
        </div>
        <PresentCategories quizzes={finishedQuizzes} />
      </div>
      {/* <Button variant="default" size="default">Results</Button> */}
    </main>
  );
}

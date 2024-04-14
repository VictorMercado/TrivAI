"use client";
import { usePathname } from "next/navigation";
import { Clock } from "@components/Clock";
import { cn } from "@trivai/lib/utils";

type QuizViewProps = {
  totalScore: number;
  questionsLength: number;
  assignedFrom?: string;
  className?: string;
};
interface Routes {
  [key: string]: JSX.Element;
}

const QuizMetaDataView = ({
  totalScore,
  questionsLength,
  assignedFrom,
  className,
}: QuizViewProps) => {
  const routes: Routes = {
    quizzes: (
      <>
        <p>Current Score: {totalScore}</p>
        <Clock text="" />
        <p>Questions left: {questionsLength}</p>
      </>
    ),
    allegianceQuiz: (
      <>
        <p>Allegiance Score: 10</p>
        <Clock text="sdf" />
        <p>Assigned From: {assignedFrom}</p>
      </>
    ),
  };
  // /quiz/1
  const pathname = usePathname();
  const currentRoute = pathname?.split("/")[1];
  if (!currentRoute) return null;

  return (
    <div
      className={cn(
        className,
        "flex w-full flex-nowrap justify-between py-4 font-bold",
      )}
    >
      {routes[currentRoute]}
    </div>
  );
};

export { QuizMetaDataView };

"use client";
import { usePathname } from "next/navigation";

interface QuizViewProps {
  totalScore: number;
  questionsLength: number;
  assignedFrom?: string;
}
interface Routes {
  [key: string]: JSX.Element;
}

const QuizMetaDataView = ({ totalScore, questionsLength, assignedFrom }: QuizViewProps) => {
  const routes: Routes = {
    "quizzes": (
      <>
        <p>Current Score: {totalScore}</p>
        <p>Questions left: {questionsLength}</p>
      </>
    ),
    "allegianceQuiz": (
      <>
        <p>Allegiance Score: 10</p>
        <p>Assigned From: {assignedFrom}</p>
      </>
    ),
  };
  // /quiz/1
  const pathname = usePathname();
  const currentRoute = pathname?.split("/")[1];
  if (!currentRoute) return null;
  
  return (
    <div className="font-bold py-4 flex flex-nowrap justify-between w-full">
      {routes[currentRoute]}
    </div>
  );
};

export { QuizMetaDataView };

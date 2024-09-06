"use client";
import { useState } from "react";
import { HorizontalScroll } from "@/src/components/ui/horizontal-scroll";
import { QuizCard } from "@/src/components/ui/quiz-card";
import { ArrowDown } from "lucide-react";
import { TQuizViewProps } from "@trivai/lib/server/queries/quiz";

type AllUsersQuizzesProps = {
  quizzes: Array<TQuizViewProps>;
};

const AllUsersQuizzes = ({ quizzes }: AllUsersQuizzesProps) => {
  const [quizzesState, setQuizzesState] = useState(quizzes);

  const destroyQuiz = (id : number) => {
    console.log("destroying quiz", id);
    setQuizzesState(quizzesState.filter((quiz) => quiz.id !== id));
  }

  return (
    <div className="space-y-2">
      <h1 className="flex items-center gap-x-4 text-3xl">
        Community Quizzes
        <ArrowDown className="h-4 w-4 text-primary" />
      </h1>
      <HorizontalScroll>
        {quizzesState.length > 0 ? (
          quizzesState.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} destroySelf={destroyQuiz} />)
        ) : (
          <p className="coolText"> No quizzes assigned to Friends </p>
        )}
      </HorizontalScroll>
    </div>
  );
};

export { AllUsersQuizzes };

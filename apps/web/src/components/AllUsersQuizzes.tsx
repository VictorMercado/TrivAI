"use client";
import { HorizontalScroll } from "@/src/components/ui/horizontal-scroll";
import { QuizCard } from "@/src/components/ui/quiz-card";
import { ArrowDown } from "lucide-react";
import { TQuizViewProps } from "@trivai/lib/server/queries/quiz";

type AllUsersQuizzesProps = {
  quizzes: Array<TQuizViewProps>;
};

const AllUsersQuizzes = ({ quizzes }: AllUsersQuizzesProps) => {
  return (
    <div className="space-y-2">
      <h1 className="flex items-center gap-x-4 text-3xl">
        Community Quizzes
        <ArrowDown className="h-4 w-4 text-primary" />
      </h1>
      <HorizontalScroll>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
        ) : (
          <p className="coolText"> No quizzes assigned to Friends </p>
        )}
      </HorizontalScroll>
    </div>
  );
};

export { AllUsersQuizzes };

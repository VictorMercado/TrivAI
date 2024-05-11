"use client";
import { HorizontalScroll } from "@/src/components/ui/horizontal-scroll";
import { QuizCard } from "@/src/components/ui/quiz-card";
import { ArrowDown } from "lucide-react";
import {
  type TQuizzesView,
} from "@trivai/lib/server/queries/quiz";
import { trpc } from "@t/client";
import { Button } from "@ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

type AssignedSelfQuizzesProps = {
  quizzes: TQuizzesView;
};

const AssignedSelfQuizzes = ({quizzes}: AssignedSelfQuizzesProps) => {
  const {data, error} = trpc.authViewer.user.getAssignedSelfQuzzies.useQuery(undefined, {
    initialData: quizzes,
  });
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [generatedFilter, setGeneratedFilter] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <h1 className="flex items-center justify-between text-3xl">
        <div className="flex items-center gap-x-4">
          Assigned yourself
          <ArrowDown className="h-4 w-4 text-primary" />
        </div>
        {/* <Button variant="default" size="sm">
          <SlidersHorizontal className="h-4 w-6" />
          Filter
        </Button> */}
      </h1>
      <HorizontalScroll>
        {
          // JSON.stringify(quizzesToDisplay, null, 2)
          data.length > 0 ? (
            data.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
          ) : (
            <p className="coolText"> Horray no quizzes left </p>
          )
        }
      </HorizontalScroll>
    </div>
  );
};

export { AssignedSelfQuizzes };

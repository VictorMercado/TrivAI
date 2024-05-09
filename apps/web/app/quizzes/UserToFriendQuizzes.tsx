"use client";
import { HorizontalScroll } from "@/src/components/ui/horizontal-scroll";
import { QuizCard } from "@/src/components/ui/quiz-card";
import { ArrowDown } from "lucide-react";
import { TQuizView, TQuizzesView } from "@trivai/lib/server/queries/quiz";
import { trpc } from "@t/client";

type UserToFriendQuizzesProps = {
  quizzes: TQuizzesView;
};

const UserToFriendQuizzes = ({ quizzes }: UserToFriendQuizzesProps) => {
  const { data, error } =
    trpc.authViewer.user.getUserToFriendAssignedQuizzes.useQuery(undefined, {
      initialData: quizzes,
    });
  return (
    <div className="space-y-2">
      <h1 className="flex items-center gap-x-4 text-3xl">
        Assigned To Friends
        <ArrowDown className="h-4 w-4 text-primary" />
      </h1>
      <HorizontalScroll>
        {data && data.length > 0 ? (
          data.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
        ) : (
          <p className="coolText"> No quizzes assigned to Friends </p>
        )}
      </HorizontalScroll>
    </div>
  );
};

export { UserToFriendQuizzes };
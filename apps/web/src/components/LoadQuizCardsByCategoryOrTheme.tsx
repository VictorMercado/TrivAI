"use client";
import { trpc } from "@t/client";
import { QuizCard } from "@ui/quiz-card";
import { Button } from "@ui/button";

type LoadQuizCardProps = {
  categoryId: number;
  themeId?: number;
};

const getQuizHandlerByProps = (props: LoadQuizCardProps) => {
  if (props.themeId) {
    const { categoryId, themeId } = props;
    return trpc.authViewer.quiz.getAllByTheme.useQuery({ categoryId, themeId });
  }
  throw new Error("ThemeId is required");
};

const getQuizHandlerByCategory = (categoryId: number) => {
  return trpc.authViewer.quiz.getAllByCategory.useQuery({ categoryId });
};

const LoadQuizCardsByCategoryOrTheme = ({ categoryId, themeId }: LoadQuizCardProps) => {
  let data, error;
  if (categoryId && themeId) {
    ({ data, error } = getQuizHandlerByProps({ categoryId, themeId }));
  } else {
    ({ data, error } = getQuizHandlerByCategory(categoryId));
  }
  if (error) return <div>An Error Occured</div>;
  if (!data) return (
    <div className="flex h-44 w-full items-center justify-center">
      <p>Loading...</p>
    </div>
  );

  return (
    <>
      {data.length > 0 ? (
        data.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={{ ...quiz, status: "Not Started", time: 0 }}
          />
        ))
      ) : (
        <div className="flex h-44 w-full items-center justify-center">
          <p>No Quizzes Generated</p>
        </div>
      )}
    </>
  );
};

export { LoadQuizCardsByCategoryOrTheme };

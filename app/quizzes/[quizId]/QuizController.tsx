"use client";
import { useStore } from "@src/store";
import { CheatCode } from "@components/CheatCode";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QuestionView } from "@ui/questionView";
import { getDate } from "@src/utils";
import { QuizCompleted } from "@components/QuizCompleted";
import { QuizMetaDataView } from "@ui/quizMetaDataView";
import { Clock } from "@components/Clock";
import { useUnmount } from "@/src/hooks/useUnmount";
// import QuestionOptions from '@/app/components/QuestionOptions';

export type ReturnedAnswer = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

const QuizController = ({
  quizId,
  activeQuestions,
}: {
  quizId: number | undefined;
  activeQuestions: any;
}) => {
  console.log(getDate());
  let router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { totalScore, incrementScore, cheatUsed } = useStore((state) => state);
  const [questions, setQuestions] = useState<any[]>(activeQuestions);
  let question = questions[0] || null;
  const questionId = question?.id;
  const answers = [
    question?.answer1,
    question?.answer2,
    question?.answer3,
    question?.answer4,
  ];
  const [returnedAnswer, setReturnedAnswer] = useState<ReturnedAnswer | null>(
    null,
  );
  const [text, setText] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState(false);
  /** HandleClick will only execute when questions exist */
  const handleCheckAnswer = async (answer: string) => {
    let res;
    try {
      res = await fetch("/api/checkAnswer", {
        method: "PUT",
        body: JSON.stringify({
          quizId,
          answer,
          userId,
          questionId,
          completed: questions.length === 1,
        }),
      });
    } catch (e) {
      alert("Error Occured!");
    }
    if (res?.status === 200) {
      const data: ReturnedAnswer = await res.json();
      if (data.correct) {
        incrementScore(3);
      }
      setReturnedAnswer({
        correct: data.correct,
        correctAnswer: data.correctAnswer,
        userAnswer: data.userAnswer,
      });
      setHasAnswered(!hasAnswered);
    } else if (res?.status === 409) {
      alert("You already answered this question!");
    } else if (res?.status === 500) {
      alert("Something wrong with the server!");
      return;
    }
    // router.refresh(); // temporary fix since being linked to this page does not refresh the cache
  };
  const handleQuestionsSlice = () => {
    setQuestions(questions.slice(1));
    setHasAnswered(!hasAnswered);
    setReturnedAnswer(null);
    if (questions.length === 1) {
      router.refresh();
    }
  };

  useUnmount(() => {
    fetch(`/api/quizzes/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        alert(data);
      });
    alert("dismounted");
  });

  return (
    <>
      {!cheatUsed ? <CheatCode /> : ""}
      <div className="container flex flex-col items-center justify-center">
        <Clock text="sdf" />
        <QuizMetaDataView
          totalScore={totalScore}
          questionsLength={questions.length}
        />
        {question ? (
          <QuestionView
            image={question.image}
            text={<QuestionView.Text text="Can you guess the image⁉️" />}
            correct={
              hasAnswered && returnedAnswer ? (
                <QuestionView.Correct correct={returnedAnswer.correct} />
              ) : null
            }
            next={
              hasAnswered &&
              userId && (
                <QuestionView.NextButton nextAction={handleQuestionsSlice} />
              )
            }
            buttonsOrResults={
              hasAnswered && returnedAnswer ? (
                <QuestionView.Results
                  returnedAnswer={returnedAnswer}
                  answers={answers}
                />
              ) : (
                <QuestionView.Buttons
                  answers={answers}
                  handleCheckAnswer={
                    userId ? handleCheckAnswer : handleQuestionsSlice
                  }
                />
              )
            }
          />
        ) : (
          <QuizCompleted />
        )}
      </div>
    </>
  );
};

export { QuizController };

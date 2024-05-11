"use client";
import { useStore } from "@src/store";
import { CheatCode } from "@components/CheatCode";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDate } from "@trivai/lib/utils";
import { QuizCompleted } from "@components/QuizCompleted";
import { QuizMetaDataView } from "@ui/quizMetaDataView";
import { useUnmount } from "@/src/hooks/useUnmount";
import type { TQuestionView } from "@trivai/lib/server/queries/quiz";
import {
  QuestionView,
  QuestionButtons,
  QuestionResults,
  QuestionImage,
  QuestionText,
  QuestionShowCorrect,
  QuestionNextButton,
  type ReturnedAnswer,
} from "@ui/questionView";
import { useToast } from "@ui/toast";
import { shuffle } from "@trivai/lib/utils";
import { CREDITSPERQUESTION } from "@/src/config/constants";
// import QuestionOptions from '@/app/components/QuestionOptions';

type QuizControllerProps = {
  quizId: number | undefined;
  activeQuestions: Array<TQuestionView>;
  scoreAmt: number;
};

const QuizController = ({
  quizId,
  activeQuestions,
  scoreAmt,
}: QuizControllerProps) => {
  // console.log(getDate());
  let router = useRouter();
  let { addToast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { totalScore, cheatUsed, incrementScore, incrementCredits } = useStore((state) => state);
  const [questions, setQuestions] =
    useState<Array<TQuestionView>>(activeQuestions);
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
  const [isLoading, setIsLoading] = useState(false);
  /** HandleClick will only execute when questions exist */
  const handleCheckAnswer = async (answer: string) => {
    setIsLoading(true);
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
      if (data.correct && userId) {
        addToast({
          id: Math.random(),
          message: CREDITSPERQUESTION + " Credits added!",
          type: "success",
        });
        incrementScore(scoreAmt);
        incrementCredits();
      }
      setReturnedAnswer({
        correct: data.correct,
        correctAnswer: data.correctAnswer,
        userAnswer: data.userAnswer,
      });
      setHasAnswered(!hasAnswered);
      setIsLoading(false);
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

  // useUnmount(() => {
  //   fetch(`/api/quizzes/${quizId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((e) => {
  //       console.log(
  //         "error occured cause this needs to be in TRPC in QuizController.tsx",
  //       );
  //     });
  //   alert("dismounted");
  // });

  return (
    <>
      {!cheatUsed ? <CheatCode /> : ""}
      {question ? (
        <div className="container flex grow flex-col items-center justify-center p-4">
          <QuizMetaDataView
            questionsLength={questions.length}
            className="text-sm "
          />
          <QuestionView className="h-3/4">
            {question.image && (
              <QuestionImage
                image={question.image}
                width={1500}
                height={1500}
                alt={"Question image"}
              />
            )}
            <div className="flex h-1/2 flex-col items-center justify-center">
              <QuestionText>{question.text}</QuestionText>
            </div>
            <div>
              <div className="flex w-full justify-between">
                {hasAnswered && returnedAnswer && (
                  <QuestionShowCorrect correct={returnedAnswer.correct} />
                )}
                {hasAnswered && (
                  <QuestionNextButton nextAction={handleQuestionsSlice} />
                )}
              </div>
              {hasAnswered && returnedAnswer ? (
                <QuestionResults
                  returnedAnswer={returnedAnswer}
                  answers={answers}
                />
              ) : (
                <QuestionButtons
                  isLoading={isLoading}
                  answers={answers}
                  handleCheckAnswer={
                    handleCheckAnswer
                  }
                />
              )}
            </div>
          </QuestionView>
        </div>
      ) : (
        <div className="container flex grow flex-col items-center justify-center p-4">
          <QuizCompleted />
        </div>
      )}
    </>
  );
};

export { QuizController };

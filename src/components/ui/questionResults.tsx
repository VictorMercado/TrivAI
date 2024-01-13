"use client";
import { useEffect, useRef } from "react";
import type { ReturnedAnswer } from "@/app/quizzes/[quizId]/QuizController";

type QuestionResultsProps = {
  answers: Array<string> | undefined;
  returnedAnswer: ReturnedAnswer;
};

const QuestionResults = ({ answers, returnedAnswer }: QuestionResultsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserAnswerCorrect =
    returnedAnswer?.correct &&
    returnedAnswer.correctAnswer == returnedAnswer.userAnswer;
  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });
  return (
    <div className="my-10 grid grid-cols-2 gap-4 text-center text-xl md:gap-8">
      {answers?.map((answer, index) => {
        const isCorrectAnswer = returnedAnswer.correctAnswer === answer;
        const isCorrectUserAnswer = returnedAnswer.userAnswer === answer;
        return (
          <div
            ref={scrollRef}
            className={`border border-primary py-4 text-primary bg-primary/25
                ${
                  isCorrectAnswer
                    ? "!lg:hover:bg-green-500 !border-green-500 !bg-green-500 !text-black"
                    : ""
                }
                ${
                  !isUserAnswerCorrect && isCorrectUserAnswer
                    ? "!border-red-500 !bg-red-500 !text-black !lg:hover:bg-red-500"
                    : ""
                }
                `}
            key={index}
          >
            <b>{answer}</b>
          </div>
        );
      })}
    </div>
  );
};

export { QuestionResults };

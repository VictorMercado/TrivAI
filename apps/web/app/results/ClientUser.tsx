"use client";

//TODO: Refactor component
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { SVGGoodCheck, SVGError, SVGPercentage } from "@ui/SVG";
import { type MergedUserAssignedQuiz } from "@trivai/lib/server/queries/quiz/helpers";
import { QuestionAnswerViewController } from "@components/QuestionAnswerViewController";
import { Button } from "@ui/button";
import { Calendar } from "@components/Calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useToast } from "@ui/toast";

interface ClientUserProps {
  years?: Array<number>;
  months?: Array<number>;
  initQuizzes: Array<MergedUserAssignedQuiz>;
}

export const ClientUser = ({ initQuizzes }: ClientUserProps) => {
  const { addToast } = useToast();
  const scrollToQuizRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const [callbackFn, setCallbackFn] = useState<any>([]);
  const [userAnswerId, setUserAnswerId] = useState<string>();

  const [quizzes, setQuizzes] = useState(initQuizzes);

  useEffect(() => {
    if (callbackFn?.length > 0) {
      callbackFn.forEach((fn: () => void) => {
        fn();
      });
      setCallbackFn([]);
    }
  }, [callbackFn]);

  const handleClick = async (
    year: number,
    month: number,
    week: number,
    day: number,
  ) => {
    const res = await fetch(
      `/api/quizResults?year=${year}&month=${month}&week=${week}&day=${day}`,
    );
    if (res.status === 200) {
      const data = await res.json();
      setQuizzes(data);
      setCallbackFn([
        ...callbackFn,
        () => {
          if (quizRef?.current) {
            quizRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            quizRef.current.focus({
              preventScroll: true,
            });
          }
        },
      ]);
    } else if (res.status === 404) {
      addToast({id: Math.random(), message: "No quiz found!", type: "error"});
    } else {
      addToast({id: Math.random(), message: "Something went wrong! " + res.status, type: "error"});
    }
  };
  return (
    <div className="flex flex-col gap-2 p-4 text-lg transition-colors duration-500 4xl:grid 4xl:grid-cols-2">
      <Calendar
        years={[2023, 2024]}
        months={[
          { monthNumber: 0, monthName: "January" },
          { monthNumber: 1, monthName: "Feburary" },
          { monthNumber: 2, monthName: "March" },
        ]}
        onDayClick={handleClick}
      />
      <div
        ref={scrollToQuizRef}
        className="mx-auto grid w-full grid-cols-2 gap-4 lg:gap-6 xl:grid-cols-4"
      >
        {quizzes?.map((quiz: any, index: number) => {
          let quizLength;
          let correctAnswers;
          let grade = 0;
          if (quiz.userAnswers.length > 0) {
            quizLength = quiz.userAnswers.length;
            correctAnswers = quiz.userAnswers.reduce(
              (prev: number, curr: any) => {
                return prev + curr.correctAnswer;
              },
              0,
            );
            grade = Math.round((correctAnswers / quizLength) * 100);
          }
          // using a tag instead of Link because Link does not refresh cache on dynamic routes yet
          return (
            <a
              className="group mx-2 my-6 flex flex-col shadow shadow-primary/50 backdrop-blur-sm  transition-all ease-out"
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
            >
              <h1 className={`text-xl text-primary`}>
                {quiz.quizCategory.category.name}
              </h1>
              <div className="flex h-full flex-col gap-y-2 border-y-2 border-primary p-2  group-hover:bg-primary/20">
                <div
                  ref={index === 0 ? quizRef : null}
                  className="grid grid-cols-1 gap-y-4"
                >
                  <span className="flex flex-col md:flex-row md:justify-between">
                    <p className="text-primary">
                      <b>Quiz ID:</b>
                    </p>
                    <p>{quiz.id}</p>
                  </span>
                  <span className="flex flex-col md:flex-row md:justify-between">
                    <p className="text-primary">
                      <b>Quiz Status:</b>
                    </p>
                    <p
                      className={`text-left md:text-right ${
                        quiz.status === "Completed"
                          ? "text-green-500"
                          : quiz.status === "Incomplete"
                            ? "text-yellow-500"
                            : "text-blue-500"
                      }`}
                    >
                      <span className="">{`${quiz.status}`}</span>
                    </p>
                  </span>
                  <span className="flex flex-col md:flex-row md:justify-between">
                    <p className="text-primary">
                      <b>Theme:</b>
                    </p>
                    <p className="text-left md:text-right">
                      {quiz.quizCategory.theme.name}
                    </p>
                  </span>
                  <span className="flex flex-col md:flex-row md:justify-between">
                    <p className="text-primary">
                      <b>Score:</b>
                    </p>
                    <p>{quiz.scoreAmt}</p>
                  </span>
                  <span className="flex flex-col md:flex-row md:justify-between">
                    <p className="text-primary">
                      <b>Grade %:</b>
                    </p>
                    <p>
                      <SVGPercentage size={50} percentage={grade} />
                    </p>
                  </span>
                </div>
                <div
                  className="flex flex-col p-1 hover:ring-2 hover:ring-primary"
                  onClick={(e) => e.preventDefault()}
                >
                  <Collapsible className="">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex justify-between">
                        <p className="text-primary">
                          <b>Answers ({quiz.userAnswers.length}):</b>
                        </p>
                        <ChevronsUpDown />
                      </div>
                    </CollapsibleTrigger>
                    {/* data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down */}
                    <CollapsibleContent className="group data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      {quiz.userAnswers.map((answer: any, index: number) => (
                        <button
                          key={answer.id}
                          className="w-full p-2 group-data-[state=closed]:hidden group-data-[state=open]:animate-fadeIn md:hover:ring-2 md:hover:ring-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setUserAnswerId(answer.id);
                            setCallbackFn([
                              ...callbackFn,
                              () => {
                                if (dialogRef?.current) {
                                  dialogRef.current?.showModal();
                                }
                              },
                            ]);
                          }}
                          aria-label={`answer number ${index + 1} `}
                        >
                          <span className="grid grid-cols-2 gap-x-2 break-normal">
                            <p>{answer.selectedAnswer}</p>
                            <span className="flex items-center justify-center">
                              {answer.correctAnswer ? (
                                <SVGGoodCheck size={20} />
                              ) : (
                                <SVGError size={20} />
                              )}
                            </span>
                          </span>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      {/* Add results of how other users answered this question use D3 for chart for more visualization */}
      <dialog
        ref={dialogRef}
        className="z-10 m-auto bg-background p-4 text-center text-lg text-blue-500 backdrop:bg-slate-700/50"
      >
        <p className="m-2 font-bold">Your Result</p>
        <QuestionAnswerViewController
          answerId={userAnswerId}
        />
        <form method="dialog" className="flex justify-center">
          <Button
            variant="default"
            size="default"
            className="px-6 py-2"
            alt-text="close dialog"
          >
            OK
          </Button>
        </form>
      </dialog>
    </div>
  );
};

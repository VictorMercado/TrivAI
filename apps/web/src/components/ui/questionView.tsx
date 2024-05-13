"use client";
import Image from "next/image";
import React, { useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@ui/button";
import { cn } from "@trivai/lib/utils";

export type ReturnedAnswer = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

type QuestionButtonsProps = {
  isLoading?: boolean;
  answers: Array<string> | undefined;
  handleCheckAnswer: (answer: string) => void;
};

const QuestionButtons = ({
  answers,
  handleCheckAnswer,
  isLoading
}: QuestionButtonsProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref?.current) {
      ref.current?.focus();
    }
  }); 

  return (
    <div className="my-10 grid grid-cols-2 gap-4 md:gap-8">
      {answers?.map((answer, index) => (
        <Button
          key={index}
          variant={`${isLoading ? "loading" : "default"}`}
          size="default"
          onClick={() => handleCheckAnswer(answer)}
          ref={index === 0 ? ref : undefined}
          className="py-4"
          disabled={isLoading}
        >
          {answer}
        </Button>
      ))}
    </div>
  );
};

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
            className={`border border-primary bg-primary/25 py-4 text-primary
                ${
                  isCorrectAnswer
                    ? "!lg:hover:bg-green-500 !border-green-500 !bg-green-500 !text-black"
                    : ""
                }
                ${
                  !isUserAnswerCorrect && isCorrectUserAnswer
                    ? "!lg:hover:bg-red-500 !border-red-500 !bg-red-500 !text-black"
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

type QuestionShowCorrectProps = {
  correct: boolean;
};

const QuestionShowCorrect = ({ correct }: QuestionShowCorrectProps) => {
  return (
    <>
      {correct ? (
        <div className="border-4 border-green-500 px-4 py-2">
          <b className="text-green-500">CORRECT</b>
        </div>
      ) : (
        <div className="border-4 border-red-500 px-4 py-2 font-bold">
          <b className="text-red-500">INCORRECT</b>
        </div>
      )}
    </>
  );
};

type QuestionImageProps = {
  image: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
};

const QuestionImage = ({
  image,
  width,
  height,
  alt,
  className,
  ...props
}: QuestionImageProps) => {
  return (
    <Image
      unoptimized
      src={image}
      width={width}
      height={height}
      alt={alt}
      className={cn(className, "object-cover")}
      {...props}
    />
  );
};

type QuestionTextProps = {
  children: React.ReactNode;
};

const QuestionText = ({ children }: QuestionTextProps) => {
  return (
    <h1 className="px-4 text-center text-3xl">
      <b>{children}</b>
    </h1>
  );
};

type QuestionNextButtonProps = {
  nextAction: () => void;
};

const QuestionNextButton = ({ nextAction }: QuestionNextButtonProps) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (ref?.current) {
      ref.current?.focus();
    }
  });
  return (
    <Button
      variant="special"
      size="default"
      className="px-2 py-2 hover:shadow-[0px_0px_15px_.5px_#0ff] focus:shadow-[0px_0px_15px_.5px_#0ff]"
      onClick={nextAction}
      ref={ref}
    >
      NEXT &#9002;&#9002;
    </Button>
  );
};

export type Question = {
  id: string;
  image: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
};

type QuestionViewProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
};

// Implement 3 different views:
// For User Results: basic view but coloring the correct/incorrect buttons
// For Answering Question: normal view to select answer
// For Question Answered: show correct/incorrect answer and next button
const QuestionView = ({
  children,
  className,
  ref,
  ...props
}: QuestionViewProps) => {
  return (
    <div
      className={cn(className, "flex flex-col gap-y-4")}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  QuestionView,
  QuestionButtons,
  QuestionResults,
  QuestionShowCorrect,
  QuestionImage,
  QuestionText,
  QuestionNextButton,
};

"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@ui/button";

type QuestionButtonsProps = {
  answers: Array<string> | undefined;
  handleCheckAnswer: (answer: string) => void;
};

const QuestionButtons = ({
  answers,
  handleCheckAnswer,
}: QuestionButtonsProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref?.current) {
      ref.current?.focus();
    }
  });
  return (
    <div className="my-10 grid grid-cols-2 gap-4 md:gap-8">
      {answers?.map((answer, index) => {
        return (
          <Button
            key={index}
            variant="default"
            size="default"
            ref={index === 0 ? ref : null}
            className="py-4"
            onClick={() => handleCheckAnswer(answer)}
          >
            <b>{answer}</b>
          </Button>
        );
      })}
    </div>
  );
};

export { QuestionButtons };

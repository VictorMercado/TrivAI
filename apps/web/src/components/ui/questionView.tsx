"use client";
import Image from "next/image";
import React from "react";
import { QuestionButtons } from "./questionButtons";
import { NextButton } from "./next-button";
import { QuestionCorrect } from "./questionCorrect";
import { QuestionResults } from "./questionResults";
import { QuestionText } from "./questionText";

export type Question = {
  id: string;
  image: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
};

type QuestionViewProps = {
  imageWidth?: number;
  imageHeight?: number;
  /**
   * @description image is needed for the user to guess
   **/
  image: string;
  /**
   * @description is optional because it will appear when the user has answered the question and is ready to move on
   **/
  next?: React.ReactNode;
  /**
   * @description conditionally render a component to either display the answer options or the results
   **/
  buttonsOrResults: React.ReactNode;
  /**
   * @description component to display correct/incorrect state
   **/
  correct?: React.ReactNode;

  /**
   * @param text - component only accepts strings
   * @description component to display text
   */
  text?: React.ReactNode;
};

// Implement 3 different views:
// For User Results: basic view but coloring the correct/incorrect buttons
// For Answering Question: normal view to select answer
// For Question Answered: show correct/incorrect answer and next button
const QuestionView = ({
  imageWidth = 1500,
  imageHeight = 1500,
  image,
  buttonsOrResults,
  next,
  correct,
  text,
}: QuestionViewProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Image
        src={image}
        alt={"AI generated image to guess"}
        width={imageWidth}
        height={imageHeight}
      />
      <div className="grid grid-cols-1">
        {text}
        <div className="z-10 flex justify-between ">
          <div className="flex items-center">{correct}</div>
          <div className="flex items-center">{next}</div>
        </div>
      </div>
      {buttonsOrResults}
    </div>
  );
};
QuestionView.Buttons = QuestionButtons;

QuestionView.NextButton = NextButton;

QuestionView.Correct = QuestionCorrect;

QuestionView.Results = QuestionResults;

QuestionView.Text = QuestionText;

export { QuestionView };

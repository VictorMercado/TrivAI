import React, { useEffect, useState } from "react";
import {
  QuestionView, 
  QuestionResults,
  QuestionShowCorrect,
  QuestionImage,
  QuestionText,
 } from "./ui/questionView";
import type { Answer } from "@/pages/api/getAnswer";

type QuestionViewControllerProps = {
  answerId: string | undefined;
};

async function getAnswer(answerId: string): Promise<Answer> {
  let res;
  try {
    res = await fetch(`api/getAnswer?answerId=${answerId}`);
  } catch (e) {
    alert("Error Occured!");
  }

  if (res?.ok) {
    const data = await res.json();
    return data;
  } else {
    return Promise.reject("Error Occured!");
  }
}

const QuestionAnswerViewController = ({
  answerId,
}: QuestionViewControllerProps) => {
  const [answerObj, setAnswerObj] = useState<Answer>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (answerId) {
      getAnswer(answerId)
        .then((answer) => {
          if (!answer) throw new Error("Error Occured!");
          setAnswerObj(answer);
        })
        .catch((e) => {
          setError(e);
        });
    }
    console.log("mounting");
    return () => {
      console.log("unmounting");
    };
  }, [answerId]);

  return (
    <div>
      {error ? <div>{error}</div> : null}
      {answerObj ? (
        <>
          <QuestionView className="h-3/4">
            {answerObj.question.image && (
              <QuestionImage
                image={answerObj.question.image}
                width={1500}
                height={1500}
                alt={"Question image"}
              />
            )}
            <div className="flex h-1/2 flex-col items-center justify-center">
              <QuestionText>{answerObj.question.text}</QuestionText>
            </div>
            <div className="flex w-full justify-between">
              <QuestionShowCorrect correct={answerObj.returnedAnswer.correct} />
            </div>
            <QuestionResults
              returnedAnswer={answerObj.returnedAnswer}
              answers={answerObj.answers}
            />
          </QuestionView>
        </>
      ) : null}
    </div>
  );
};


export { QuestionAnswerViewController };

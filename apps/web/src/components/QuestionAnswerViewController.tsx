import React, { useEffect, useState } from "react";
import { QuestionView } from "./ui/questionView";
import type { Answers } from "@/pages/api/getAnswer";

type QuestionViewControllerProps = {
  imageWidth?: number;
  imageHeight?: number;
  answerId: string | undefined;
};

async function getAnswer(answerId: string): Promise<Answers> {
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

const QuestionAnswerViewController: React.FC<QuestionViewControllerProps> = ({
  imageHeight,
  imageWidth,
  answerId,
}: QuestionViewControllerProps) => {
  const [answerObj, setAnswerObj] = useState<Answers>();
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
        <QuestionView
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          image={answerObj.returnedAnswer.image}
          correct={
            <QuestionView.Correct correct={answerObj.returnedAnswer.correct} />
          }
          next={<div>report</div>}
          buttonsOrResults={
            <QuestionView.Results
              answers={answerObj.answers}
              returnedAnswer={answerObj.returnedAnswer}
            />
          }
        />
      ) : null}
    </div>
  );
};

export { QuestionAnswerViewController };

"use client";
import {
  useOthers,
  useMyPresence,
  useBroadcastEvent,
  useEventListener,
} from "@/liveblocks.config";
import { Cursor } from "./Cursor";
import { Button } from "@ui/button";
import { useEffect, useRef, useState } from "react";
import { Selections } from "./Selections";
import type { TQuestionView } from "@trivai/lib/server/queries/quiz";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/toast";
import { useSession } from "@trivai/auth/react";
import { useStore } from "@src/store";
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
import { QuizMetaDataView } from "@ui/quizMetaDataView";
import { QuizCompleted } from "@components/QuizCompleted";
import { trpc } from "@t/client";

type MultiplayerQuizProps = {
  quizId: number;
  activeQuestions: Array<TQuestionView>;
  scoreAmt: number;
  roomId: string;
};

const MultiplayerQuizController = ({
  quizId,
  activeQuestions,
  scoreAmt,
  roomId,
}: MultiplayerQuizProps) => {
  const others = useOthers();
  const othersCount = others.length;
  const divRef = useRef<HTMLDivElement>(null);
  const [
    { cursor, hoveredElement, selectedId, selectedAnswer, userId, hostData: myHostData},
    updateMyPresence,
  ] = useMyPresence();
  const [width, setWidth] = useState(0);
  const [height, setWHeight] = useState(0);
  const othersHoveredElement = others.map(
    ({ presence }) => presence.hoveredElement,
  );
  let router = useRouter();
  let { addToast } = useToast();
  const { data: session } = useSession();
  // const userId = session?.user.id;
  const { incrementScore, incrementCredits } = useStore(
    (state) => state,
  );
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
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allUsersCount = othersCount + 1;
  const othersSelectedCount = others.reduce(
    (prev, { presence }) => prev + (presence?.selectedId ? 1 : 0),
    0,
  );
  const allUsersSelectedCount = othersSelectedCount + (selectedId ? 1 : 0);
  const hasAllUsersSelected = allUsersSelectedCount === allUsersCount;
  const mySelectedAnswer = selectedId && selectedAnswer
    ? { selectedAnswer: selectedAnswer, userId: session!.user!.id, selectedId: selectedId }
    : null;
  const allOthersAnswers = others.map(({ presence }) => {
    if (!presence.selectedId) return null;
    if (!presence.selectedAnswer) return null;
    if (!presence.userId) return null;
    return {
      selectedAnswer: presence.selectedAnswer,
      userId: presence.userId,
      selectedId: presence.selectedId,
    };
  });
  const allUsersAnswers = [...allOthersAnswers, mySelectedAnswer];
  const host = roomId.split("_")[0];
  const broadCast = useBroadcastEvent();

  const checkAnswers = trpc.authViewer.question.checkAnswers.useMutation(
    {
      onSuccess: (data) => {
        if (data.correct) {
          if (data.allCorrectAnswers) {
            addToast({
              id: Math.random(),
              message: "All answers correct. 30 Credits added!",
              type: "success",
            });
            incrementScore(scoreAmt);
            incrementCredits(30);
            broadCast({
              type: "allCorrect",
              role: host ? "host" : "user",
            });
          } else {
            addToast({
              id: Math.random(),
              message: "At least 1 answer correct. 10 Credits added!",
              type: "success",
            });
            incrementScore(scoreAmt);
            incrementCredits();
            broadCast({
              type: "oneCorrect",
              role: host ? "host" : "user",
            });
          }
        }
        setReturnedAnswer({
          correct: data.correct,
          correctAnswer: data.correctAnswer,
          userAnswer: data.userAnswer,
        });
        setHasAnswered(!hasAnswered);
        setIsLoading(false);
        console.log(data.otherAnswers);
        broadCast({
          type: "hasAnswered",
          role: host ? "host" : "user",
        });
        broadCast({
          type: "notLoading",
          role: host ? "host" : "user",
        });
        broadCast({
          type: "results",
          role: host ? "host" : "user",
          data: data.otherAnswers,
        });
      },
      onError: (e) => {
        alert("Error Occured!");
      },
    },
  );

  const handleCheckAnswers = async ({ quizId, userId, questionId, completed, answers }: {
    quizId: number;
    userId: string;
    questionId: string;
    completed: boolean;
    answers: Array<{ selectedAnswer: string; userId: string; selectedId: string }>;
  }) => {
    if (host === session?.user?.userName) {
      setIsLoading(true);
      broadCast({
        type: "loading",
        role: host ? "host" : "user",
      });
      updateMyPresence({
        hostData: {
          currentQuestionId: questionId,
          othersAnswers: null,
          everyoneLoad: true,
          everyoneHasAnswered: false,
          allAnswersCorrect: null,
          correctAnswer: null,
          everyoneSlice: null,
        },
      });
      checkAnswers.mutate({
        quizId,
        userId,
        questionId,
        completed,
        answers,
      });
    } else {
      addToast({
        id: Math.random(),
        message: "Only the host can submit answers!",
        type: "error",
      });
    }
  }

  const handleQuestionsSlice = () => {
    setQuestions(questions.slice(1));
    setHasAnswered(!hasAnswered);
    setReturnedAnswer(null);
    if (questions.length === 1) {
      router.refresh();
    }
  };

  useEventListener(({ event, user, connectionId }) => {
    //                       ^^^^ Will be Client A
    if (event.type === "loading" && event.role === "host" ) {
      setIsLoading(true);
    }
    if (event.type === "notLoading" && event.role === "host") {
      setIsLoading(false);
    }
    if (event.type === "hasAnswered" && event.role === "host") {
      setHasAnswered(true);
    }
    if (event.type === "notHasAnswered" && event.role === "host") {
      setHasAnswered(false);
    }
    if (event.type === "allCorrect" && event.role === "host") {
      addToast({
        id: Math.random(),
        message: "All answers correct. 30 Credits added!",
        type: "success",
      });
      incrementScore(scoreAmt);
      incrementCredits(30);
    }
    if (event.type === "oneCorrect" && event.role === "host") {
      addToast({
        id: Math.random(),
        message: "At least 1 answer correct. 10 Credits added!",
        type: "success",
      });
      incrementScore(scoreAmt);
      incrementCredits();
    }
    if (event.type === "slice" && event.role === "host" || event.role === "user") {
      handleQuestionsSlice();
      updateMyPresence({
        selectedId: null,
        selectedAnswer: null,
        hoveredElement: null,
      });
    }
    if (event.type === "currentQuestion" && event.role === "host") {
      router.refresh();
    }
    if (event.type === "results" && event.role === "host") {
      const myData = event.data?.find((data) => data.userId === session?.user?.id);
      setReturnedAnswer({
        correct: myData!.correct,
        correctAnswer: myData!.correctAnswer,
        userAnswer: myData!.selectedAnswer,
      });
    }
  });

  useEffect(() => {
    if (!divRef.current) return;
    setWidth(divRef.current.offsetWidth);
    setWHeight(divRef.current.offsetHeight);
  }),
    [
      divRef.current?.offsetHeight,
      divRef.current?.offsetWidth,
      divRef.current?.clientHeight,
      divRef.current?.clientWidth,
      divRef.current,
    ];

  useEffect(() => {
    // if (!hasQuizStarted) return;
    document.cookie = `quizMultiplayerSession=true; path=/quizzes/${quizId}/multiplayer; max-age=3600;`;
    // }, [hasQuizStarted]);
  }, []);
  
  return (
    <div
      ref={divRef}
      className="relative flex w-full flex-col items-center justify-center"
      onPointerMove={(event) => {
        // Update the user cursor position on every pointer move
        updateMyPresence({

          cursor: {
            ratioX: event.clientX / width,
            ratioY: event.clientY / height,
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        // When the pointer goes out, set cursor to null
        updateMyPresence({
          cursor: null,
        })
      }
    >
      <>
        {/* {!cheatUsed ? <CheatCode /> : ""} */}
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
                  {hasAnswered && userId && host && (
                    <QuestionNextButton nextAction={() => {
                      handleQuestionsSlice();
                      // this will reset the state of all users to prepare for the next question
                      updateMyPresence({
                        selectedId: null,
                        selectedAnswer: null,
                        hoveredElement: null,
                      });
                      broadCast({
                        type: "slice",
                        role: host
                          ? "host"
                          : "user",
                      });
                    }} />
                  )}
                </div>
                {hasAnswered && returnedAnswer ? (
                  <QuestionResults
                    returnedAnswer={returnedAnswer}
                    answers={answers}
                  />
                ) : (
                  <div className="flex w-full flex-col">
                    <p className="text-right">
                      {allUsersSelectedCount} / {allUsersCount} ready
                    </p>
                    <div className="my-10 grid w-full grid-cols-2 gap-4 md:gap-8">
                      {answers?.map((answer, index) => (
                        <div className="relative flex" key={index}>
                          <Button
                            id={`${index + 1}`}
                            variant={`${isLoading ? "loading" : "default"}`}
                            size="default"
                            disabled={isLoading}
                            onPointerEnter={(e) =>
                              updateMyPresence({
                                hoveredElement: {
                                  // @ts-ignore
                                  id: e.target.id,
                                },
                              })
                            }
                            onClick={(e) => {
                              // @ts-ignore
                              e.target.focus();
                              updateMyPresence({
                                selectedId: `${index + 1}`,
                                selectedAnswer: answer,
                              });
                              // handleCheckAnswer(answer);
                            }}
                            onFocus={(e) => {
                              updateMyPresence({
                                selectedId: e.target.id,
                                selectedAnswer: answer,
                              });
                            }}
                            // onBlur={() =>
                            //   updateMyPresence({
                            //     selectedId: null,
                            //   })
                            // }
                            onPointerLeave={() =>
                              updateMyPresence({
                                hoveredElement: null,
                              })
                            }
                            className={`w-full py-4 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${othersHoveredElement.find((element) => element?.id === `${index + 1}`) ? "bg-primary text-black" : ""}`}
                          >
                            {answer}
                          </Button>
                          <Selections id={`${index + 1}`} />
                        </div>
                      ))}
                    </div>
                    {/* <div className="mt-8 flex flex-col justify-center">
                      {allUsersAnswers.map((answer) => {
                        if (!answer) return null;
                        return (
                          <div key={answer.userId}>
                            <p>{answer.userId}</p>
                            <p>
                              {answer.selectedId} - {answer.selectedAnswer}
                            </p>
                          </div>
                        );
                      })}
                    </div> */}
                    <div className="mt-8 flex justify-center">
                      <Button
                        variant="default"
                        size="default"
                        disabled={!hasAllUsersSelected}
                        onClick={() => {
                          hasAllUsersSelected &&
                            userId &&
                            host &&
                             handleCheckAnswers({
                              quizId,
                              userId,
                              questionId,
                              completed: questions.length === 1,
                              // @ts-ignore
                              answers: allUsersAnswers,
                            });
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
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

      {
        /**
         * Iterate over other users and display a cursor based on their presence
         */
        others.map(({ connectionId, presence }) => {
          if (presence.cursor === null) {
            return null;
          }

          return (
            <Cursor
              key={`cursor-${connectionId}`}
              // connectionId is an integer that is incremented at every new connections
              // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
              color={
                presence.primaryColor || `hsl(${connectionId % 360}, 100%, 50%)`
              }
              x={Math.round(presence.cursor.ratioX * width) - 50}
              y={Math.round(presence.cursor.ratioY * height) - 30}
            />
          );
        })
      }
    </div>
  );
};

export { MultiplayerQuizController };

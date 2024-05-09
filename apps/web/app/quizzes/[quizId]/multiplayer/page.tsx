import { getUser } from "@trivai/lib/server/queries/user";
import { MultiplayerLobby } from "./MultiplayerLobby";
import { MultiplayerQuizController } from "./MultiplayerQuiz";
import { Room } from "./Room";
import { getQuiz } from "@trivai/lib/server/queries/quiz";
import {
  PrismaQuestionSelectView,
  getQuizWithQuestions,
} from "@trivai/lib/server/queries/quiz";
import { prisma } from "@trivai/prisma";
import { shuffle, isDigit } from "@trivai/lib/utils";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";

async function getUserQuizWithUnansweredQuestions(
  quizId: number,
  filterAnswersArray: { id: { equals: string } }[] | [],
) {
  return await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      scoreAmt: true,
      questions: {
        select: PrismaQuestionSelectView,
        where: {
          NOT: filterAnswersArray,
        },
      },
    },
  });
}

async function getUserAnswerQuizCompleted(userId: string, quizId: number) {
  if (!userId) {
    return;
  }
  // TODO: HANDLE ERROR
  const quizCompleted = await prisma.userAnsweredQuiz.findUnique({
    where: {
      quizId_userId: {
        quizId: quizId,
        userId: userId,
      },
    },
    select: {
      completed: true,
      userAnswers: true,
    },
  });
  return quizCompleted;
}

type MultiplayerPageProps = {
  searchParams: { [key: string]: string | undefined };
};

export default async function MultiplayerPage({
  searchParams,
}: MultiplayerPageProps) {
  const cookieStore = cookies();
  const user = await getUser();
  const userSession = await getCurrentUser();
  const roomId = searchParams["roomid"];
  const quizId = roomId?.split("_")[1];
  const haveSession = cookieStore.get("quizMultiplayerSession");

  if (quizId && isDigit(quizId) === false) {
    return notFound();
  }
  if (!roomId) {
    return <div>Room not found</div>;
  }
  if (!user || !userSession) {
    return <div>Not logged in</div>;
  }
  const quizIdInt = parseInt(quizId as string);
  let quiz;
  if (user) {
    let quizCompleted;
    try {
      // if user has not attempted quiz then getUserAnswerQuiz will return undefined
      quizCompleted = await getUserAnswerQuizCompleted(user.id, quizIdInt);
      // console.log(quizCompleted)
    } catch (e) {
      console.log("error getting user quiz", e);
    }
    if (quizCompleted && haveSession?.value !== "true") {
      return (
        <div className="p-4 text-center">
          <h1>You started this Quiz already</h1>
          <p>You have to reset this quiz to continue</p>
          <p>Dont worry you will not lose any points or credits</p>
          <p>If you did already, please refresh the website.</p>
        </div>
      );
    }
    const userQuizAnswers = quizCompleted?.userAnswers;

    // make array of question ids that the user has already answered or empty array
    const userAnswers = userQuizAnswers
      ? userQuizAnswers.map((userAnswer) => {
          return { id: { equals: userAnswer.questionId } };
        })
      : [];
    quiz = await getUserQuizWithUnansweredQuestions(quizIdInt, userAnswers);
  }
  // quiz = await getQuizWithQuestions(quizIdInt);
  
  // see if there is a better way to do this
  if (!quiz) {
    return notFound();
  }

  let questions = quiz.questions.map((question) => {
    let answers = [
      question.answer1,
      question.answer2,
      question.answer3,
      question.answer4,
    ];
    answers.sort();
    return {
      ...question,
      answer1: answers[0],
      answer2: answers[1],
      answer3: answers[2],
      answer4: answers[3],
    };
  });
  return (
    <div className="flex flex-grow">
      <Room roomId={roomId} user={user}>
        <MultiplayerQuizController
          quizId={quizIdInt}
          activeQuestions={questions}
          scoreAmt={quiz.scoreAmt}
          roomId={roomId}
        />
      </Room>
      {/* <MultiplayerRoom roomId={roomId} /> */}
    </div>
  );
}

import { QuizController } from "./QuizController";
import { notFound } from "next/navigation";
import { prisma } from "@trivai/prisma";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { TabSwitcher } from "@ui/tab-switcher";
import { QuizCompleted } from "@components/QuizCompleted";
import { shuffle, isDigit } from "@trivai/lib/utils";
import {
  PrismaQuestionSelectView,
  getQuizWithQuestions,
} from "@trivai/lib/server/queries/quiz";
import { CREDITSPERQUESTION } from "@src/config/constants";

interface Routes {
  [key: string]: JSX.Element;
}

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
  const quizCompleted = await prisma.userAnsweredQuiz.findFirst({
    where: {
      userId: userId,
      quizId: quizId,
    },
    select: {
      completed: true,
      userAnswers: true,
    },
  });
  return quizCompleted;
}

type QuizIdPageProps = {
  params: { quizId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function QuizIdPage({
  params: { quizId },
  searchParams,
}: QuizIdPageProps) {

  if (isDigit(quizId) === false) {
    return notFound();
  }

  const quizIdInt = parseInt(quizId);
  let quiz = await getQuizWithQuestions(quizIdInt);

  if (!quiz) {
    return notFound();
  }

  const user = await getCurrentUser();
  if (user) {
    let quizCompleted;
    try {
      // if user has not attempted quiz then getUserAnswerQuiz will return undefined
      quizCompleted = await getUserAnswerQuizCompleted(user.id, quizIdInt);
    } catch (e) {
      alert(e + " Please sign out and sign back in.");
    }
    if (quizCompleted?.completed) {
      return <QuizCompleted />;
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
    answers = shuffle(answers);
    return {
      ...question,
      answer1: answers[0],
      answer2: answers[1],
      answer3: answers[2],
      answer4: answers[3],
    };
  });

  return (
    <>
      <QuizController
        quizId={quiz?.id}
        activeQuestions={questions}
        scoreAmt={quiz.scoreAmt}
      />
    </>
  );
}

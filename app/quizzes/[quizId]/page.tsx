import { QuizController } from "./QuizController";
import { notFound } from "next/navigation";
import { db } from "@src/db";
import { getCurrentUser } from "@src/session";
import { Prisma } from "@prisma/client";
import { TabSwitcher } from "@ui/tab-switcher";
import { QuizCompleted } from "@components/QuizCompleted";
import { shuffle } from "@src/utils";

interface Routes {
  [key: string]: JSX.Element;
}

async function getQuiz(quizId: number) {
  return await db.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      questions: {
        select: {
          id: true,
          image: true,
          answer1: true,
          answer2: true,
          answer3: true,
          correctAnswer: true,
        },
        take: 5,
      },
    },
  });
}

async function getUserQuiz(
  quizId: number,
  filterAnswersArray: { id: { equals: string } }[] | [],
) {
  return await db.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      questions: {
        select: {
          id: true,
          image: true,
          answer1: true,
          answer2: true,
          answer3: true,
          correctAnswer: true,
        },
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
  const quizCompleted = await db.userAnswerQuiz.findFirst({
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
const isDigit = (str: string) => {
  return /^\d+$/.test(str);
};

export type Quiz = Prisma.PromiseReturnType<typeof getQuiz>;
export type Question = {
  id: string;
  image: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
};
type QuizIdPageProps = {
  params: { quizId: string };
};
export default async function QuizIdPage({
  params: { quizId },
}: QuizIdPageProps) {
  if (isDigit(quizId) === false) {
    return notFound();
  }
  const quizIdInt = parseInt(quizId);
  let quiz = await getQuiz(quizIdInt);
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
    // get user answers[] or undefined
    const userQuizAnswers = quizCompleted?.userAnswers;
    // start timer
    // console.time();

    // make array of question ids that the user has already answered or empty array
    const userAnswers = userQuizAnswers
      ? userQuizAnswers.map((userAnswer) => {
          return { id: { equals: userAnswer.questionId } };
        })
      : [];
    // get quiz with questions that the user has not answered
    quiz = await getUserQuiz(quizIdInt, userAnswers);
  }

  const questions: Array<Question> = quiz!.questions.map(
    ({ correctAnswer, answer1, answer2, answer3, ...question }) => {
      let answer4 = correctAnswer;
      const newArr = shuffle([answer1, answer2, answer3, answer4]);
      answer1 = newArr[0];
      answer2 = newArr[1];
      answer3 = newArr[2];
      answer4 = newArr[3];
      return { ...question, answer1, answer2, answer3, answer4 };
    },
  );
  // end timer
  // console.timeEnd();
  return (
    // <>
    //   <TabSwitcher routes={activeCategoriesArray} />
    //   <main className="">
    //     {user ? (
    //       <ClientAuthenticatedQuiz activeQuestions={activeQuestions} />
    //     ) : (
    //       // give the guest less questions
    //       <ClientUnauthenticatedQuiz
    //         activeQuestions={activeQuestions.slice(
    //           Math.floor(activeQuestions.length * .5)
    //         )}
    //       />
    //     )}
    //   </main>
    // </>
    <>
      <QuizController quizId={quiz?.id} activeQuestions={questions} />
      {/* <pre>{JSON.stringify(quiz?.questions, null, 2)}</pre> */}
    </>
  );
}

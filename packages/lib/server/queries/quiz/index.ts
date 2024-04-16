import { Prisma } from "@prisma/client";
import { prisma } from "@trivai/prisma";

const AIOVERLORD_ID = "0000000000";

export type TQuestion = Prisma.PromiseReturnType<typeof getQuestion> & { answer4: string; };
export type TQuestionView = Omit<TQuestion, "correctAnswer">;

export type TAIAssignedQuizzesPresentation = Prisma.PromiseReturnType<typeof getPublicAIAssignedQuizzesForPresentation>;
export type TQuizViewProps = TAIAssignedQuizzesPresentation[0];
export type TQuizView = { status?: string; time?: number; } & TQuizViewProps;
export type TQuizzesView = Array<{ status: string; time: number; } & TQuizViewProps>;
export type TUserAnsweredQuizzesWithoutAnswers = Prisma.PromiseReturnType<
  typeof getUserAnsweredQuizzes
>;
export type TUserAnsweredQuizzesWithAnswers = Prisma.PromiseReturnType<
  typeof getUsersAnsweredQuizzesWithAnswers
>;
export type TAssignedQuiz = Prisma.PromiseReturnType<typeof getQuiz>;
export type TQuiz = Prisma.PromiseReturnType<typeof getQuiz>;

export type AssignedQuizzes = {
  id: number;
  scoreAmt: number;
  image: string | null;
  quizCategory: {
    theme: {
      name: string;
    } | null;
    category: {
      name: string;
    };
  };
}[] | undefined;


export const PrismaUserAnsweredQuizWithoutAnswersSelectView = {
  id: true,
  time: true,
  completed: true,
  quizId: true,
};

export const PrismaQuizSelectView = {
  id: true,
  scoreAmt: true,
  dateDue: true,
  genStatus: true,
  likes: true,
  shares: true,
  completions: true,
  saves: true,
  image: true,
  createdAt: true,
  owner: {
    select: {
      image: true,
      userName: true,
    },
  },
  quizCategory: {
    select: {
      category: {
        select: {
          name: true,
          quizLength: true,
        },
      },
      theme: {
        select: {
          name: true,
          quizLength: true,
        }
      },
    },
  },
}

export const PrismaQuestionSelectView = {
  id: true,
  image: true,
  text: true,
  answer1: true,
  answer2: true,
  answer3: true,
  answer4: true,
  quizId: true,
};

export const PrismaQuestionWithAnswerSelectView = {
  id: true,
  image: true,
  text: true,
  answer1: true,
  answer2: true,
  answer3: true,
  answer4: true,
  correctAnswer: true,
  quizId: true,
};

const PrismaQuestionWithUserAnswersSelectView = {
  id: true,
  image: true,
  text: true,
  answer1: true,
  answer2: true,
  answer3: true,
  correctAnswer: true,
  quizId: true,
  userAnswers: {
    select: {
      selectedAnswer: true,
      correctAnswer: true,
      quizId: true,
      userId: true,
      // userAnsweredQuizId: true,
    }
  }

};


export async function getQuestion(questionId: string) {
  return await prisma.question.findFirst({
    where: {
      id: questionId,
    }, 
    select: PrismaQuestionSelectView,
  });
}

export async function getUserOwnedQuizzes(userId: string) {
  return await prisma.quiz.findMany({
    where: {
      ownerId: userId,
    },
    select: PrismaQuizSelectView,
  });
}

export async function getPublicAIAssignedQuizzesForPresentation() {
  return await prisma.quiz.findMany({
    where: {
      ownerId: AIOVERLORD_ID,
    },
    select: PrismaQuizSelectView,
    take: -5,
  });
};

export async function getUserAIAssignedQuizzesForPresentation(userId: string) {
  return await prisma.userAssignedQuiz.findMany({
    where: {
      assigneeId: userId,
      userId: AIOVERLORD_ID,
    },
    select: {
      quiz: {
        select: PrismaQuizSelectView,
      },
    },
  });
}


/**
 * 
 * @param id represents the quiz id
 * @returns the quiz object
 */

export async function getQuiz(id: number) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    select: PrismaQuizSelectView,
  });
  return quiz;
}

export async function getQuizWithQuestions(id: number) {
  return await prisma.quiz.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      scoreAmt: true,
      questions: {
        select: PrismaQuestionSelectView,
      },
    },
  });
}

export async function getUserAssignedQuizIdsForPresentation(userId: string) {
  return await prisma.userAssignedQuiz.findMany({
    where: {
      userId: userId,
    },
    select: {
      quizId: true,
    },
  });
}

export async function getUserAssignedQuizzesForPresentation(userId : string) {
  return await prisma.userAssignedQuiz.findMany({
    where: {
      assigneeId: userId,
      userId: userId,
    },
    select: {
      id: true,
      createdAt: true,
      quiz: {
        select: PrismaQuizSelectView,
      },
    }
  });
}

/**
 * 
 * @param userId
 * @param quizId
 * @returns This function returns an array of objects of all the user's answered quizzes based on all given quiz ids
 * @description 
 */
export async function getUsersAnsweredQuizzesWithAnswers(userId: string | undefined, quizIds: number[] = []) {
  if (!userId) {
    return [];
  }
  return await prisma.userAnsweredQuiz.findMany({
    where: {
      userId: userId,
      quizId: {
        in: quizIds,
      },
    },
    select: {
      id: true,
      completed: true,
      time: true,
      quizId: true,
      userAnswers: true,
    },
  });
}

export async function getUserAnsweredQuiz(userId: string, quizId: number) {
  return await prisma.userAnsweredQuiz.findFirst({
    where: {
      userId: userId,
      quizId: quizId,
    },
    select: PrismaUserAnsweredQuizWithoutAnswersSelectView,
  });
}

export async function getUserAnsweredQuizzes(userId: string | undefined, quizIds: number[] = []) {
  if (!userId) {
    return [];
  }
  return await prisma.userAnsweredQuiz.findMany({
    where: {
      userId: userId,
      quizId: {
        in: quizIds,
      },
    },
    select: PrismaUserAnsweredQuizWithoutAnswersSelectView,
  });
}

export async function getUserAssignedQuizzesToFriends(userId: string) {
  return await prisma.userAssignedQuiz.findMany({
    where: {
      userId: userId,
      assigneeId: {
        notIn: [AIOVERLORD_ID, userId],
      },
    },
    select: {
      assigneeId: true,
      quiz: {
        select: PrismaQuizSelectView,
      },
    },
  });
}

export async function getFriendAssignedQuizzesToUser(userId: string) {
  return await prisma.userAssignedQuiz.findMany({
    where: {
      assigneeId: userId,
      userId: {
        not: userId,
      },
    },
    select: {
      quiz: {
        select: PrismaQuizSelectView,
      }
    },
  });
}
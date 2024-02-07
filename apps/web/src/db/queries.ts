import { prisma } from "@trivai/prisma";
import { Prisma } from "@prisma/client";

export type AssignedQuiz = Prisma.PromiseReturnType<typeof getQuiz>;

type UserSelectObject = {
  id?: boolean;
  userName?: boolean;
  role?: boolean;
  name?: boolean;
  email?: boolean;
  image?: boolean;
  credits?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  totalScore?: boolean;
  allegiance?: boolean;
};

export async function getUserWithProperties(userQuery: { userId: string; properties: Array<keyof UserSelectObject>; }) {
  const userSelectObject: UserSelectObject = userQuery.properties.reduce((acc, curr) => {
    Object.defineProperty(acc, curr, { value: true, enumerable: true });
    return acc;
  }, {});

  const user = await prisma.user.findFirst({
    where: { id: userQuery.userId },
    select: userSelectObject,
  });
  return user;
}

/**
 * 
 * @param id represents the quiz id
 * @returns the quiz object
 */

export async function getQuiz(id: number) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    select: {
      scoreAmt: true,
      allegianceQuiz: true,
      sharedQuiz: true,
      owner: true,
      quizCategory: {
        select: {
          category: true,
          keywordPrompt: true,
        },
      },
    },
  });
  return quiz;
}

/**
 * @param year represented as a 4 digit number
 * @param month represented as a number from 1-12
 * @returns All quiz Ids for a given month
 */

export async function getMonthQuizzes(year: number, month: number) {
  const res = await prisma.year.findFirstOrThrow({
    where: {
      year: year,
    },
    select: {
      months: {
        where: {
          month: month,
        },
        select: {
          weeks: {
            select: {
              week: true,
              days: {
                select: {
                  day: true,
                  quizzes: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return res.months[0].weeks;
}

/**
 * @param year represented as a 4 digit number
 * @param month represented as a number from 1-12
 * @param week represented as a number from 1-5
 * @param day represented as a number from 1-7
 * @returns This function returns the quizzes for a given day
 */

export async function getTodayQuizzes(year: number, month: number, week: number, day: number) {
  return await prisma.year.findFirstOrThrow({
    where: {
      year: year,
    },
    select: {
      months: {
        where: {
          month: month,
        },
        select: {
          weeks: {
            where: {
              week: week,
            },
            select: {
              days: {
                where: {
                  day: day,
                },
                select: {
                  quizzes: {
                    select: {
                      id: true,
                      scoreAmt: true,
                      quizCategory: {
                        select: {
                          image: true,
                          category: true,
                          keywordPrompt: {
                            select: {
                              keyword: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * 
 * @param userId
 * @param quizId
 * @returns This function returns an array of objects of all the user's answered quizzes based on all given quiz ids
 * @description 
 */
export async function getUsersAnswerQuizzes(userId: string | undefined, quizIds: number[] = []) {
  if (!userId) {
    return [];
  }
  return await prisma.userAnswerQuiz.findMany({
    where: {
      userId: userId,
      quizId: {
        in: quizIds,
      },
    },
    select: {
      id: true,
      completed: true,
      quizId: true,
      userAnswers: true,
    },
  });
}

export type Users = Prisma.PromiseReturnType<typeof getUsers>;
export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: false,
      userName: true,
      role: true,
      cheatUsed: true,
      totalScore: true,
      image: true,
      primaryColor: true,
    },
  });
}
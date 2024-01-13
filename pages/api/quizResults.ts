import { authOptions } from "@/src/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { db } from "@/src/db";
import { mergeQuizzes } from "@/src/db/helpers";


// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session : Session | null = await getServerSession(req, res, authOptions);
  console.log("quizresults api running");
  
  if (session) {
    // res.status(200).json({message: req.query});
    if (req.method == 'GET') {            
      const { year, month, week, day } = req.query!;
      const quizYear = await db.year.findFirst({
        where: {
            year: parseInt(year as string),
        },
        select: {
            // id: true,
            // year: true,
          months: {
            where: {
              month: parseInt(month as string),
            },
            select: {
              // id: true,
              // month: true,
              weeks: {
                where: {
                  week: parseInt(week as string),
                },
                select: {
                  // id: true,
                  // week: true,
                  days: {
                    where: {
                      day: parseInt(day as string),
                    },
                    select: {
                      // id: true,
                      // day: true,
                      quizzes: {
                        select: {
                          id: true,
                          scoreAmt: true,
                          quizCategory: {
                            select: {
                              image: true,
                              keywordPrompt: {
                                select: {
                                  keyword: true,
                                },
                              },
                              category: {
                                select: {
                                  name: true,
                                },
                              }
                            }
                          }
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
      
      if (quizYear && quizYear.months[0]?.weeks[0]?.days[0]?.quizzes) {
        const quizzes = quizYear?.months[0]?.weeks[0]?.days[0]?.quizzes;
        const quizIds = quizzes?.map((quiz) => quiz.id);
        const userQuizzes = await db.userAnswerQuiz.findMany({
          where: {
            userId: session.user.id,
              quizId: {
                in: quizIds,
              },
          },
          select: {
            id: true,
            completed: true,
            quizId: true,
            userAnswers: true,
            // quiz: {
            //   select: {
            //     scoreAmt: true,
            //     id: true,
            //     quizCategory: {
            //       select: {
            //         image: true,
            //         keywordPrompt: {
            //           select: {
            //             keyword: true,
            //           },
            //         },
            //         category: {
            //           select: {
            //             name: true,
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
          },
        });
        const mergedQuizzes = mergeQuizzes(quizzes, userQuizzes);
        res.status(200).json(mergedQuizzes);
        return;
      }
      else {
        res.status(404).json({message: "Not Found"});
        return;
      }
    }
  }
  res.status(403).json({message: "Forbidden"});
  return;
}
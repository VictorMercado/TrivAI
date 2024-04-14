import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";
import { getSessionWithReqRes } from "@trivai/auth/lib/getSessionWithReqRes";
import { CREDITSPERQUESTION } from "@/src/config/constants";

// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getSessionWithReqRes(req, res);
  if (session) {
    if (req.method == 'PUT') {
      let { quizId, questionId, userId, answer, completed } = JSON.parse(req.body);

      let user = await prisma.user.findFirst({
        where: {
          id: userId
        }, 
        select: {
          id: true,
          totalScore: true,
          creditsMultiplier: true,
        }
      });
      let question = await prisma.question.findUnique({
        where: {
          id: questionId
        },
        select: {
          correctAnswer: true,
        }
      });
      let quiz = await prisma.quiz.findUnique({
        where: {
          id: parseInt(quizId)
        }
      });
      if (!quiz) {
        res.status(404).json({ message: "Quiz Not Found" });
        return;
      }
      if (question && user) {
        // findFirst returns undefined if no record is found
        const isAnswered = await prisma.userAnswer.findFirst({
          where: {
            userId: userId,
            questionId: questionId
          }
        });
        // if the user has already answered this question, return a 409
        if (isAnswered) {
          res.status(409).json({ message: "Already Answered" });
          return;
        }

        if (question.correctAnswer === answer) {
          await prisma.userAnsweredQuiz.upsert({
            where: {
              // this is a unique field in schema
              quizId_userId: {
                userId: userId,
                quizId: parseInt(quizId),
              }
            },
            update: {
              userId: userId,
              quizId: quizId,
              completed: completed,
              userAnswers: {
                create: {
                  userId: userId,
                  questionId: questionId,
                  selectedAnswer: answer,
                  correctAnswer: true,
                },
              }
            },
            create: {
              userId: userId,
              quizId: quizId,
              completed: completed,
              userAnswers: {
                create: {
                  userId: userId,
                  questionId: questionId,
                  selectedAnswer: answer,
                  correctAnswer: true,
                },
              }
            }
          });
          await prisma.user.update({
            where: {
              id: userId
            },
            data: {
              totalScore: {
                increment: quiz?.scoreAmt
              },
              credits: {
                increment: CREDITSPERQUESTION * user.creditsMultiplier
              }
            }
          });
          res.status(200).json({ correct: true, correctAnswer: question.correctAnswer, answer: answer });
          return;
        }
        else {
          await prisma.userAnsweredQuiz.upsert({
            where: {
              quizId_userId: {
                userId: userId,
                quizId: parseInt(quizId),
              }
            },
            update: {
              userId: userId,
              quizId: quizId,
              completed: completed,
              userAnswers: {
                create: {
                  userId: userId,
                  questionId: questionId,
                  selectedAnswer: answer,
                  correctAnswer: false,
                },
              }
            },
            create: {
              userId: userId,
              quizId: quizId,
              completed: completed,
              userAnswers: {
                create: {
                  userId: userId,
                  questionId: questionId,
                  selectedAnswer: answer,
                  correctAnswer: false,
                },
              }
            }
          });
          res.status(200).json({ correct: false, correctAnswer: question.correctAnswer, userAnswer: answer });
          return;
        }
      }
      else {
        res.status(404).json({ message: "User or Quesiton Not Found" });
        return;
      }
    }
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  res.status(403).json({ message: "Forbidden" });
  return;
}
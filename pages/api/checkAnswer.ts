import { authOptions } from "@/src/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { db } from "@/src/db";
import { parse } from "url";

// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method == 'PUT') {
      let { quizId, questionId, userId, answer, completed } = JSON.parse(req.body);

      let user = await db.user.findFirst({
        where: {
          id: userId
        }
      });
      let question = await db.question.findUnique({
        where: {
          id: questionId
        },
        select: {
          correctAnswer: true,
        }
      });
      if (question && user) {
        // findFirst returns undefined if no record is found
        const isAnswered = await db.userAnswer.findFirst({
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
          await db.userAnswerQuiz.upsert({
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
          res.status(200).json({ correct: true, correctAnswer: question.correctAnswer, answer: answer });
          return;
        }
        else {
          await db.userAnswerQuiz.upsert({
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
import { authOptions } from "@/src/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";
import { parse } from "url";

export type Answers = {
  answers: Array<string>;
  returnedAnswer: {
    image: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
  };
};

// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method == 'GET') {
      const { answerId } = req.query!;
      if (!answerId) {
        res.status(400).json({ message: "Bad Request" });
        return;
      }
      const answer = await prisma.userAnswer.findUnique({
        where: {
          id: answerId as string,
        },
        select: {
          selectedAnswer: true,
          correctAnswer: true,
          question: {
            select: {
              image: true,
              correctAnswer: true,
              answer1: true,
              answer2: true,
              answer3: true,
            }
          }
        }
      });
      if (answer) {
        let answers: Answers = {
          answers: [answer.question.answer1, answer.question.answer2, answer.question.answer3, answer.question.correctAnswer],
          returnedAnswer: {
            image: answer.question.image ? answer.question.image : "",
            correct: answer.correctAnswer,
            userAnswer: answer.selectedAnswer,
            correctAnswer: answer.question.correctAnswer,
          }
        };
        res.status(200).json(answers);
        return;
      }
    }
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  res.status(403).json({ message: "Forbidden" });
  return;
}
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";
import { getSessionWithReqRes } from "@trivai/auth/lib/getSessionWithReqRes";

export type Answer = {
  question: {
    image: string;
    text?: string;
  },
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
  const session: Session | null = await getSessionWithReqRes(req, res);
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
              answer4: true,
              text: true,
            }
          }
        }
      });
      if (answer) {
        let returnedAnswer: Answer = {
          question: {image: answer.question.image ? answer.question.image : "", text: answer.question.text ? answer.question.text : ""},
          answers: [answer.question.answer1, answer.question.answer2, answer.question.answer3, answer.question.answer4],
          returnedAnswer: {
            image: answer.question.image ? answer.question.image : "",
            correct: answer.correctAnswer,
            userAnswer: answer.selectedAnswer,
            correctAnswer: answer.question.correctAnswer,
          }
        };
        res.status(200).json(returnedAnswer);
        return;
      }
    }
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  res.status(403).json({ message: "Forbidden" });
  return;
}
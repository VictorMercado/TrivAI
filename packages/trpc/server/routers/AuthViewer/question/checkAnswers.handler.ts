import { Context } from "@trivai/trpc/server/context";
import { ZodError } from "zod";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TRPCError } from "@trpc/server";
import { TCheckAnswers } from "./checkAnswers.schema";

type CheckAnswersHandlerProps = {
  ctx: Context;
  input: TCheckAnswers;
};
// {
//   quizId: number;
//   userId: string;
//   questionId: string;
//   completed: boolean;
//   answers: {
//     userId: string;
//     answer: string;
//     selectedId: string;
//   } [];
// }
export const checkAnswers = async ({ ctx, input }: CheckAnswersHandlerProps) => {
  const { prisma } = ctx;
  const { quizId, userId, questionId, completed, answers } = input;
  let userAnswer = answers.find((answer) => answer.userId === userId);
  let otherAnswers : any = [];
  let isOneCorrect;
  let isAllCorrect;
  // let allCorrectAnswers = [];
  let correctAnswer = await prisma.question.findFirst({
    where: {
      id: questionId,
    },
    select: {
      correctAnswer: true,
    },
  });
  if (!correctAnswer) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Question Not Found",
    });
  }
  isOneCorrect = answers.some((answer) => answer.selectedAnswer === correctAnswer!.correctAnswer);
  isAllCorrect = answers.every((answer) => answer.selectedAnswer === correctAnswer!.correctAnswer);
  const quiz = await prisma.quiz.findFirst({
    where: {
      id: quizId,
    },
  });
  if (!quiz) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Quiz Not Found",
    });
  }
  for (const answer of answers) {
    const isAnswered = await prisma.userAnswer.findFirst({
      where: {
        userId: answer.userId,
        questionId: questionId,
      },
    });
    if (isAnswered) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Already Answered",
      });
    }
    otherAnswers.push({
      userId: answer.userId,
      selectedAnswer: answer.selectedAnswer,
      selectedId: answer.selectedId,
      correct: answer.selectedAnswer === correctAnswer.correctAnswer,
      correctAnswer: correctAnswer.correctAnswer,
    });
    if (isOneCorrect) {
      if (isAllCorrect) {
        await prisma.user.update({
          where: {
            id: answer.userId,
          },
          data: {
            totalScore: {
              increment: quiz.scoreAmt,
            },
            credits: {
              increment: 30,
            },
          },
        });
      } else {
        await prisma.user.update({
          where: {
            id: answer.userId,
          },
          data: {
            totalScore: {
              increment: quiz.scoreAmt,
            },
            credits: {
              increment: 10,
            },
          },
        });
      }
    }
    await prisma.userAnsweredQuiz.upsert({
      where: {
        quizId_userId: {
          userId: answer.userId,
          quizId: quizId,
        },
      },
      update: {
        userId: answer.userId,
        quizId: quizId,
        completed: completed,
        userAnswers: {
          create: {
            userId: answer.userId,
            questionId: questionId,
            selectedAnswer: answer.selectedAnswer,
            correctAnswer: answer.selectedAnswer === correctAnswer.correctAnswer,
          },
        },
      },
      create: {
        userId: answer.userId,
        quizId: quizId,
        completed: completed,
        userAnswers: {
          create: {
            userId: answer.userId,
            questionId: questionId,
            selectedAnswer: answer.selectedAnswer,
            correctAnswer: answer.selectedAnswer === correctAnswer.correctAnswer,
          },
        },
      },
    });
  } 

  return {
    correctAnswer: correctAnswer?.correctAnswer,
    otherAnswers: otherAnswers,
    correct: isOneCorrect,
    allCorrectAnswers: isAllCorrect,
    userAnswer: userAnswer!.selectedAnswer,
  };
}
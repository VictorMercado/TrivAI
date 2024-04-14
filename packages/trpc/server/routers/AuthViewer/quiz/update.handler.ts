import { Context } from "@trivai/trpc/server/context";
import { TUpdateQuizInput } from "./update.schema";
import { getPrismaErrorDescription } from "@trivai/prisma";

type GetQuizOptions = {
  ctx: Context;
  input: TUpdateQuizInput;
};

export const update = async ({ ctx, input }: GetQuizOptions) => {
  const { prisma, session } = ctx;
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!quiz) throw new Error('Quiz not found');
  if (quiz.ownerId !== session!.user.id) throw new Error('Unauthorized');
  let updatedQuiz;
  try {
    updatedQuiz = await prisma.quiz.update({
      where: {
        id: input.id,
      },
      data: {
        dateDue: input.dateDue,
        public: input.public,
        scoreAmt: input.scoreAmt,
        quizCategoryId: input.quizCategoryId,
        image: input.image,
        questions: {
          upsert: input.questions.map((question) => ({
            where: {
              id: question.id,
            },
            update: {
              text: question.text,
              correctAnswer: question.correctAnswer,
              answer1: question.answer1,
              answer2: question.answer2,
              answer3: question.answer3,
              answer4: question.answer4,
              image: question.image,
            },
            create: {
              text: question.text,
              correctAnswer: question.correctAnswer,
              answer1: question.answer1,
              answer2: question.answer2,
              answer3: question.answer3,
              answer4: question.answer4,
              image: question.image,
            },
          })),
        },
      },
    });
  } catch (e) {
    throw new Error(getPrismaErrorDescription(e));
  }
  return updatedQuiz;
};
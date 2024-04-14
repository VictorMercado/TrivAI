import { Context } from '@trivai/trpc/server/context';
import { TUpdateQuestionInput } from './update.schema';
import { getPrismaErrorDescription } from '@trivai/prisma';

type UpdateQuestionOptions = {
  ctx: Context;
  input: TUpdateQuestionInput;
};

export const update = async ({ ctx, input }: UpdateQuestionOptions) => {
  const { prisma, session } = ctx;
  const question = await prisma.question.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!question) throw new Error('Question not found');
  // if (session!.user.id !== question.userId) throw new Error('Unauthorized');
  let updatedQuestion;
  try {
    updatedQuestion = await prisma.question.update({
      where: {
        id: input.id,
      },
      data: {
        text: input.text,
        correctAnswer: input.correctAnswer,
        answer1: input.answer1,
        answer2: input.answer2,
        answer3: input.answer3,
        image: input.image,
        quizId: input.quizId,
      },
    });
  } catch (e) {
    throw new Error(getPrismaErrorDescription(e));
  }
  return updatedQuestion;
};

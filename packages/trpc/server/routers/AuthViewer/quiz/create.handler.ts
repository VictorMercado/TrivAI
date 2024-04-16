import { Context } from "@trivai/trpc/server/context";
import { TCreateQuizInput } from "./create.schema";
import { encrypt } from "@trivai/auth/lib/encrypt";
import crypto from 'crypto';
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TRPCError } from "@trivai/trpc/server";
import { getBaseUrl } from "@trivai/lib/utils";

type GetQuizOptions = {
  ctx: Context;
  input: TCreateQuizInput;
};

export const create = async ({ ctx, input }: GetQuizOptions) => {
  const { prisma, session } = ctx;
  // let cookie = req.headers.get('cookie') || '';

  const systemMessage = "ONLY GIVE ME JSON!! An array of question objects where the text property has the question text, answer1 has an answer, answer2 has an answer, answer3 has an answer, answer4 has an answer and correctAnswer property has the correct answer where the value is one of the properties of answer1, answer2, answer3, answer4.";
  const AI_URL = process.env.AI_API_URL;
  if (session!.user.id !== input.ownerId) throw new Error('Unauthorized');
  let questionLength = input.questionLength || 10;
  let questionType = input.questionType || 'text';

  let quiz;
  let quizCategory;
  let quizJSON;
  let prompt = systemMessage + " " + `Give me a ${questionLength} question quiz about ${input.category.name} ${input.theme?.name ? 'with a focus of ' + input.theme.name : ''} ${input.userDescription ? "be sure to consider : " + input.userDescription : ''}`;
  let res;
  // create a quiz record but will not have questions connected yet this will be done in a webhook
  // quiz id will be sent to the AI API to be sent to the webhook

  try {
    if (input.theme?.id && input.theme?.name) {
      quizCategory = await prisma.quizCategory.findFirst({
        where: {
          categoryId: input.category.id,
          themeId: input.theme.id,
        },
      });
      if (!quizCategory) {
        quizCategory = await prisma.quizCategory.create({
          data: {
            userId: input.ownerId,
            basePrompt: input.userDescription || '',
            categoryId: input.category.id,
            themeId: input.theme?.id,
          },
        });
      };
    } else {
      quizCategory = await prisma.quizCategory.findFirst({
        where: {
          categoryId: input.category.id,
          themeId: null,
        },
      });
      if (!quizCategory) {
        quizCategory = await prisma.quizCategory.create({
          data: {
            userId: input.ownerId,
            basePrompt: input.userDescription || '',
            categoryId: input.category.id,
          },
        });
      };
    }
    quiz = await prisma.quiz.create({
      data: {
        scoreAmt: input.scoreAmt,
        ownerId: input.ownerId,
        quizCategoryId: quizCategory.id,
        image: input.image,
      },
    });
    await prisma.userAssignedQuiz.create({
      data: {
        year: input.year ? Number(input.year) : null,
        month: input.month ? Number(input.month) : null,
        day: input.day ? Number(input.day) : null,
        userId: input.ownerId,
        assigneeId: input.assignId,
        quizId: quiz.id,
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: getPrismaErrorDescription(e)
    });
  }

  try {
    if (AI_URL) {
      console.log("AI URL:", AI_URL);
      console.log("vercel url:", getBaseUrl());
      console.log(prompt);
      const body = {
        prompt: prompt,
        webhook: getBaseUrl() + "/api/quizzes/generate/" + quiz.id,
        quizId: quiz.id,
      };
      const stringifiedBody = JSON.stringify(body);
      
      console.log(body);
      console.log(stringifiedBody);

      let res = await fetch(AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: stringifiedBody,
      });
      if (res.ok) {
        quizJSON = await res.json();
        console.log(quizJSON);
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "AI API did not return a 200 status code",
        });
      }
    } else {
      console.log("No AI URL");
    }
  } catch (e) {
    await prisma.quiz.update({
      where: {
        id: quiz.id,
      },
      data: {
        genStatus: "FAILED",
      }
    });
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong with the AI API",
    });
  }
  return {
    status: "success",
    message: "Quiz created",
    quiz: quiz,
  };
  // return quizJSON;
};
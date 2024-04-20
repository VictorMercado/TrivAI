// this route will be the webhook that will be called by the quiz generator service
// quiz id will be sent here and the questions will be created and connected to the quiz
import { prisma } from "@trivai/prisma";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { z, ZodError } from "zod";

export async function GET(request: Request, { params } : {params: {quizId: string}}) {

  console.log(`quizzes/${params.quizId} api hit`);
  
  return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}

const ZQuestions = z.array(z.object({
  text: z.string(),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  answer4: z.string(),
  correctAnswer: z.string(),
}));

const ZQuestionWithQustionText = z.array(z.object({
  question: z.string(),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  answer4: z.string(),
  correctAnswer: z.string(),
}));

const ZQuestionsEither = z.union([ZQuestions, ZQuestionWithQustionText]);
const ZQuizImageURL = z.string();

const ZData = z.object({
  quizImageURL: ZQuizImageURL,
  questions: ZQuestionsEither,
});

const ZError = z.object({
  message: z.string(),
  error: z.boolean(),
});

const ZBody = ZData.or(ZError);
// const ZBody = ZError;

type TBody = {
  quizImageURL: string;
  questions: Array<{
    text: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    correctAnswer: string;
  }>;
  error?: {
    message: string;
    error: boolean;
  };
};


export async function POST(request: Request, { params } : {params: { quizId: string }}) {
  console.log(`quizzes/${params.quizId} api hit`);
  // const user = await getCurrentUser();
  let body : TBody; 
  try {
    body = await request.json();
  } 
  catch (e) {
    console.log("json parse failed");
    
    await prisma.quiz.update({
      where: {
        id: parseInt(params.quizId),
      },
      data: {
        genStatus: "FAILED",
        reasonForFail: "Json Parse Failed, AI did not send a valid JSON object",
      }
    });
    return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
  }
  if (body.error) {
    await prisma.quiz.update({
      where: {
        id: parseInt(params.quizId),
      },
      data: {
        genStatus: "FAILED",
        reasonForFail: body.error.message,
      }
    });
    return new Response(JSON.stringify({ message: body.error.message, error: true }), { status: 400 });
  }
  let prismaResult;
  const questions = body.questions.map((question : any) => {
    let doesCorrectAnswerExist = false;
    let questionObject : any = {
      text: question.text || question.question,
      answer1: question.answer1,
      answer2: question.answer2,
      answer3: question.answer3,
      answer4: question.answer4,
      correctAnswer: question[question.correctAnswer] || question.correctAnswer,
    };
    for (let key in questionObject) {
      if (key === "correctAnswer") continue;
      if (questionObject[key] === questionObject.correctAnswer) {
        doesCorrectAnswerExist = true;
      }
    }
    if (!doesCorrectAnswerExist) {
      return {
        text: question.text,
        answer1: question.answer1,
        answer2: question.answer2,
        answer3: question.answer3,
        answer4: questionObject.correctAnswer,
        correctAnswer: question[question.correctAnswer] || question.correctAnswer,
      };
    }
    return { ...questionObject };
  });
  try {
    prismaResult = await prisma.quiz.update({
      where: {
        id: parseInt(params.quizId),
      },
      data: {
        image: body.quizImageURL || "/Scroll.svg",
        genStatus: "DONE",
        questions: {
          create: questions,
        },
      }
    });
  } catch (e) {
    console.log(e);
    prismaResult = await prisma.quiz.update({
      where: {
        id: parseInt(params.quizId),
      },
      data: {
        genStatus: "FAILED",
        reasonForFail: "Questions could not be created in the database",
      }
    });
    return new Response(JSON.stringify({ message: "Error", status: "failed" }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: "Hello World", status: "successful" }), { status: 200 });
}
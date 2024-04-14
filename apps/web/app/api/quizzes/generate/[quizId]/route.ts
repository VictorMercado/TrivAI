// this route will be the webhook that will be called by the quiz generator service
// quiz id will be sent here and the questions will be created and connected to the quiz
import { prisma } from "@trivai/prisma";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";

export async function GET(request: Request, { params } : {params: {quizId: string}}) {

  console.log(`quizzes/${params.quizId} api hit`);
  
  return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}

export async function POST(request: Request, { params } : {params: {quizId: string}}) {
  console.log(`quizzes/${params.quizId} api hit`);
  // const user = await getCurrentUser();
  let body; 
  
  try {
    body = await request.json();
  } 
  catch (e) {
    await prisma.quiz.update({
      where: {
        id: parseInt(params.quizId),
      },
      data: {
        genStatus: "FAILED",
      }
    });
    return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
  }

  let prismaResult;
  const questions = body.map((question: any) => {
    return {
      text: question.text,
      answer1: question.answer1,
      answer2: question.answer2,
      answer3: question.answer3,
      answer4: question.answer4,
      correctAnswer: question[question.correctAnswer],
    }
  });
  try {
    prismaResult = await prisma.quiz.update({
      where: {
        id: parseInt(params.quizId),
      },
      data: {
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
      }
    });
    return new Response(JSON.stringify({ message: "Error", status: "failed" }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: "Hello World", status: "successful" }), { status: 200 });
}
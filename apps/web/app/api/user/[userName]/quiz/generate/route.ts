import { prisma } from "@trivai/prisma";

export async function GET(request: Request) {
  console.log("quizzes api hit");

  return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  try {
    const result = await prisma.quiz.create({
      data: {
        scoreAmt: body.scoreAmt,
        dateDue: body.dateDue,
        quizCategory: {
          connect: {
            id: body.quizCategoryId,
          },
        },
        owner: {
          connect: {
            id: body.ownerId,
          }
        },
      },
    });
    return new Response(JSON.stringify({ message: "Success", result: result }), { status: 200 });
  }
  catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }
}
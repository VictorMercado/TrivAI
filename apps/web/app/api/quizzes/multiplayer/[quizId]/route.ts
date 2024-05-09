import { prisma } from "@trivai/prisma";

type TBody = {};


export async function POST(request: Request, { params }: { params: { quizId: string; }; }) {

  console.log(`quizzes/${params.quizId} api hit`);
  // const user = await getCurrentUser();
  let body: TBody;
  try {
    body = await request.json();
  }
  catch (e) {
    console.log("json parse failed");
    
    return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: "Hello World", status: "successful" }), { status: 200 });
}
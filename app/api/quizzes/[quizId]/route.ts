export async function GET(request: Request, { params } : {params: {quizId: string}}) {

  console.log(`quizzes/${params.quizId} api hit`);
  
  return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}
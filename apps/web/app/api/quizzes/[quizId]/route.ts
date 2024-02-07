// this route will be for users liking, sharing, and commenting on quizzes

export async function GET(request: Request, { params } : {params: {quizId: string}}) {

  console.log(`quizzes/${params.quizId} api hit`);
  
  return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}
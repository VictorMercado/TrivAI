export async function GET(request: Request) {
  console.log("quizzes api hit");
  
  return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}
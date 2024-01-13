import { db } from '@src/db';
import { z } from 'zod';
import { getCurrentUser } from '@src/session';


const schema = z.object({
  id: z.string(),
  userName: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  image: z.string().optional(),
});

export async function GET(request: Request, { params } : {params: {userName: string}}) {
  console.log(`quizzes/${params.userName} api hit`);
  return new Response(JSON.stringify({ message: "Hello World" }), { status: 200 });
}

export async function PATCH(request: Request, { params } : {params: {userName: string}}) {
  const { userName } = params;
  const user = await getCurrentUser();
  if (user?.userName !== userName) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  const userBody = await request.json();
  try {
    schema.parse(userBody);
  }
  catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: "Bad Request" }), { status: 400 });
  }
  
  try {
    await db.user.update({
      where: {
        id: userBody.id
      },
      data: userBody
    });
  }
  catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: "Bad Request" }), { status: 400 });
  }

  return new Response(JSON.stringify(userBody), { status: 200 });
}
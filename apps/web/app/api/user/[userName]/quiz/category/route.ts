import { prisma } from "@trivai/prisma";
import { z } from "zod";

const categoryBodySchema = z.object({
  name: z.string(),
  userId: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  try {
    var parsedBody = categoryBodySchema.parse(body);
  }
  catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: "Bad Request" }), { status: 400 });
  }
  try {
    const result = await prisma.category.create({
      data: {
        name: parsedBody.name,
        user: {
          connect: {
            id: parsedBody.userId,
          },
        }
      },
    });
    return new Response(JSON.stringify({ message: "Success", result: result }), { status: 200 });
  }
  catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }
}
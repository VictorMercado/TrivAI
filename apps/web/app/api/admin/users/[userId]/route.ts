import { prisma } from "@trivai/prisma";
import { Session } from "next-auth";
import * as z from "zod";
import { getSession } from "@trivai/auth/lib/getSession";

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export async function DELETE(request: Request, context: z.infer<typeof routeContextSchema>) {
  const session: Session | null = await getSession();
  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
  }
  if (session.user.role !== "ADMIN") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  const { params: { userId } } = routeContextSchema.parse(context);
  const response = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!response) {
    return new Response(JSON.stringify({ message: "Not Found" }), { status: 404 });
  }
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
}
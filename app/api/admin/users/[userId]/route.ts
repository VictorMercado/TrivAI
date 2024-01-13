import { authOptions } from "@/src/auth";
import { db } from "@/src/db";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import * as z from "zod";

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function DELETE(request: Request, context: z.infer<typeof routeContextSchema>) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
  }
  if (session.user.role !== "ADMIN") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  const { params : {userId} } = routeContextSchema.parse(context);
  const response = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!response) {
    return new Response(JSON.stringify({ message: "Not Found" }), { status: 404 });
  }
  await db.user.delete({
    where: {
      id: userId,
    },
  });
  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
}
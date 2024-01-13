import { authOptions } from "@/src/auth";
import { db } from "@/src/db";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
  }
  if (session.user.role !== "ADMIN") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  const body = await request.json();
  const { id, email, name, role, cheatUsed, totalScore } = body;
  const response = await db.user.findFirst({
    where: {
      id: id,
    }
  });
  if (response) {
    await db.user.update({
      where: {
        id: id
      },
      data: {
        email: email,
        name: name,
        role: role,
        cheatUsed: cheatUsed,
        totalScore: parseInt(totalScore ? totalScore : "0")
      }
    });
  } else {
    return new Response(JSON.stringify({ message: "Not Found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
}
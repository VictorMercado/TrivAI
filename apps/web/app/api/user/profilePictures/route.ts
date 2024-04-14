import { prisma } from "@trivai/prisma";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const params = new URL(request.url).searchParams;
  console.log(params.get('gen'));
  const gen: number = parseInt(params.get('gen') || "1");
  const limit: number = parseInt(params.get('limit') || "10");
  const offset = parseInt(params.get('offset') || "0");
  console.log("route hit");
  console.log(gen);
  console.log(limit);
  console.log(offset);

  // const profilePictures = await prisma.profilePictureUser.findMany({
  //   where: {
  //     userId: user.id
  //   },
  //   take: limit,
  //   skip: offset,
  //   orderBy: {
  //     createdAt: 'desc'
  //   }
  // });
  const profilePictures = await prisma.profilePicture.findMany({
    where: {
      gen: gen
    },
    select: {
      name: true,
      image: true,
    },
    skip: offset,
    take: limit,
  });
  const count = await prisma.profilePicture.count({
    where: {
      gen: gen
    }
  });
  return new Response(JSON.stringify({ profilePictures, count }));
}

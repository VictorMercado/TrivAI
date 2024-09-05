import { Context } from "@trivai/trpc/server/context";

type GetPendingFriendOptions = {
  ctx: Context;
};

export const getPending = async ({ ctx }: GetPendingFriendOptions) => {
  const { prisma } = ctx;
  const session = ctx.session;
  if (!session || !session.user) {
    throw new Error("No session");
  }
  const userId = session.user.id;
  const friends =  await prisma.userFriend.findMany({
    where: {
      userId,
      status: "PENDING",
    },
    select: {
      id: true,
      friend: {
        select: {
          id: true,
          name: true,
          userName: true,
          image: true,
          prize: true,
          totalScore: true,
          credits: true,
        }
      }
    }
  });
  return friends.map(f => {
    return {
      ...f.friend,
      userName: f.friend.userName || "Ghost",
      name: f.friend.name || "No name",
      prize: f.friend.prize || "N/A",
      image: f.friend.image || "/default.png",
    };
  });
};
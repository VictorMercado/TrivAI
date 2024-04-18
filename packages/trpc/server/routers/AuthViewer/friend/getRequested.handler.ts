import { Context } from "@trivai/trpc/server/context";

type GetRequestedFriendOptions = {
  ctx: Context;
};

export const getRequested = async ({ ctx }: GetRequestedFriendOptions) => {
  const { prisma } = ctx;
  const session = ctx.session;
  if (!session) {
    throw new Error("No session");
  }
  const userId = session.user?.id;
  // the user that initiated the friend request is the userId
  // the user that received the friend request is the friendId
  // so we want to find all the friend requests that the user has received
  const friends = await prisma.userFriend.findMany({
    where: {
      friendId: userId,
      status: "PENDING",
    },
    select: {
      id: true,
      // we want to select the user that initiated the friend request
      user: {
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
      ...f.user,
      userName: f.user.userName || "Ghost",
      name: f.user.name || "No name",
      prize: f.user.prize || "N/A",
      image: f.user.image || "/default.png",
    };
  });
};
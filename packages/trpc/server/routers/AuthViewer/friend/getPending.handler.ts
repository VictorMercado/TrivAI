import { Context } from "@trivai/trpc/server/context";

type GetPendingFriendOptions = {
  ctx: Context;
};

export const getPending = async ({ ctx }: GetPendingFriendOptions) => {
  const { prisma } = ctx;
  const session = ctx.session;
  if (!session) {
    throw new Error("No session");
  }
  const userId = session.user?.id;
  return await prisma.userFriend.findMany({
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
};
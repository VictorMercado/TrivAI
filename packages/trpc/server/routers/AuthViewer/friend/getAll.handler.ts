import { Prisma } from "@prisma/client";
import { Context } from "@trivai/trpc/server/context";
import { ViewSelectGetAllFriend } from "./getAll.schema";

type GetFriendOptions = {
  ctx: Context;
};

export const getAll = async ({ ctx }: GetFriendOptions) => {
  const { prisma } = ctx;
  const session = ctx.session;
  if (!session) {
    throw new Error("No session");
  }
  const userId = session.user?.id;
  const data = await prisma.user.findUnique({
    where: {
      id : userId,
    },
    select: {
      id: true,
      friends: {
        // because in this website you can be friends with yourself
        // so we need to filter out the user itself
        where: {
          NOT: {
            friendId: userId,
          },
          status: "ACCEPTED",
        },
        select: {
          friend: {
            select: ViewSelectGetAllFriend,
          },
        },
      },
      friendOf: {
        where: {
          status: "ACCEPTED",
        },
        select: {
          user: {
            select: ViewSelectGetAllFriend,
          },
        },
      },
    }
  });
  let friends = [] as any[];
  if (data) {
    friends = [...data?.friends.map(f => f.friend), ...data?.friendOf.map(f => f.user)];
  }
  return friends;
};

type UserFriends = Prisma.PromiseReturnType<typeof getAll>;
export type Friend = UserFriends[0];


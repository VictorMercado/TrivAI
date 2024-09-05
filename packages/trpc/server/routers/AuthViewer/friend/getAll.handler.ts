import { Prisma } from "@prisma/client";
import { Context } from "@trivai/trpc/server/context";
import { ViewSelectGetAllFriend } from "./getAll.schema";
import type { Friend } from "./getAll.schema";

type GetFriendOptions = {
  ctx: Context;
};

export const getAll = async ({ ctx }: GetFriendOptions) => {
  const { prisma } = ctx;
  const session = ctx.session;
  if (!session || !session.user) {
    throw new Error("No session");
  }
  const userId = session.user.id;
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
  let friends = [] as Array<Friend>;
  if (data) {
    friends = [...data.friends.map(f => {
      return {
        ...f.friend,
        userName: f.friend.userName || "Ghost",
        name: f.friend.name || "No name",
        prize: f.friend.prize || "N/A",
        image: f.friend.image || "/default.png",
      };
    }), ...data.friendOf.map(f => {
      return {
        ...f.user,
        userName: f.user.userName || "Ghost",
        name: f.user.name || "No name",
        prize: f.user.prize || "N/A",
        image: f.user.image || "/default.png",
      };
    })];
  }
  return friends;
};

type UserFriends = Prisma.PromiseReturnType<typeof getAll>;
// export type Friend = UserFriends[0];


import { Context } from "@trivai/trpc/server/context";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TRPCError } from "@trivai/trpc/server";
import { TDeleteFriendInput } from "./delete.schema";

type DeleteFriendOptions = {
  ctx: Context;
  input: TDeleteFriendInput;
};

export const deleteFriend = async ({ ctx, input }: DeleteFriendOptions) => {
  const { prisma, session } = ctx;
  let friend;
  try {
    friend = await prisma.userFriend.findUnique({
      where: {
        userId_friendId: {
          userId: input.userId,
          friendId: input.friendId,
        },
      },
    });
  } catch (e) {
    console.error(e);
  }
  if (!friend) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Friend request not found',
    });
  }
  return await prisma.userFriend.delete({
    where: {
      userId_friendId: {
        userId: input.userId,
        friendId: input.friendId,
      },
    },
  });
}
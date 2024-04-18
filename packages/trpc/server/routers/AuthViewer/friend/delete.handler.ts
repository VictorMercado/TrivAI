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
  // let friend;
  // try {
  //   friend = await prisma.userFriend.findUnique({
  //     where: {
  //       userId_friendId: {
  //         userId: input.userId,
  //         friendId: input.friendId,
  //       },
  //     },
  //   });
  // } catch (e) {
  //   console.error(e);
  // }
  // if (!friend) {
  //   throw new TRPCError({
  //     code: 'NOT_FOUND',
  //     message: 'Friend request not found',
  //   });
  // }
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to decline a friend request',
    });
  }
  if (session.user.id !== input.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You can only decline friend requests sent to you',
    });
  }
  let completed;
  try {
    await prisma.userFriend.delete({
      where: {
        userId_friendId: {
          userId: input.userId,
          friendId: input.friendId,
        },
      },
    });
  } catch (e) {
    try {
      await prisma.userFriend.delete({
        where: {
          userId_friendId: {
            userId: input.friendId,
            friendId: input.userId,
          },
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Friend request not found',
      });
    }
  }

  return completed;
}
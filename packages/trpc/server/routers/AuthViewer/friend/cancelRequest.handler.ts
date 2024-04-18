import { Context } from "@trivai/trpc/server/context";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TRPCError } from "@trivai/trpc/server";
import { TCancelRequestInput } from "./cancelRequest.schema";

type CancelRequestOptions = {
  ctx: Context;
  input: TCancelRequestInput;
};

export const cancelRequest = async ({ ctx, input }: CancelRequestOptions) => {
  const { prisma, session } = ctx;
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
  let completed;
  try {
    completed = await prisma.userFriend.delete({
      where: {
        userId_friendId: {
          userId: input.userId,
          friendId: input.friendId,
        },
      },
    });
  } catch (e) {
    try {
      completed = await prisma.userFriend.delete({
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
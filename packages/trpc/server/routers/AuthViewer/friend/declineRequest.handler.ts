import { Context } from "@trivai/trpc/server/context";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TRPCError } from "@trivai/trpc/server";
import { TDeclineRequestInput } from "./declineRequest.schema";

type DeclineRequestOptions = {
  ctx: Context;
  input: TDeclineRequestInput;
};

export const declineRequest = async ({ ctx, input }: DeclineRequestOptions) => {
  const { prisma, session } = ctx;
  let friend;
  if (!session || !session.user) {
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
  // todo: check if this relationship needs to be checked before declining
  // try {
  //   friend = await prisma.userFriend.findUniqueOrThrow({
  //     where: {
  //       userId_friendId: {
  //         userId: input.userId,
  //         friendId: input.friendId,
  //       },
  //     },
  //   });
  // } catch (e) {
  //   try {
  //     friend = await prisma.userFriend.findUniqueOrThrow({
  //       where: {
  //         userId_friendId: {
  //           userId: input.friendId,
  //           friendId: input.userId,
  //         },
  //       },
  //     });
  //   } catch (e) {
  //     throw new TRPCError({
  //       code: 'NOT_FOUND',
  //       message: 'Friend request not found',
  //     });
  //   }
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
        code: 'INTERNAL_SERVER_ERROR',
        message: getPrismaErrorDescription(e),
      });
    }
  }
  return completed;
}


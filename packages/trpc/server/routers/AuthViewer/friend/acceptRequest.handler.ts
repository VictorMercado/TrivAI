import { Context } from "@trivai/trpc/server/context";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TRPCError } from "@trivai/trpc/server";
import { TAcceptRequestInput } from "./acceptRequest.schema";

type AcceptRequestOptions = {
  ctx: Context;
  input: TAcceptRequestInput;
};

export const acceptRequest = async ({ ctx, input }: AcceptRequestOptions) => {
  const { prisma, session } = ctx;
  let friend;
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to accept a friend request',
    });
  }
  if (session.user.id !== input.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You can only decline friend requests sent to you',
    });
  }
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
    completed = await prisma.userFriend.update({
      where: {
        userId_friendId: {
          userId: input.userId,
          friendId: input.friendId,
        },
      },
      data: {
        status: 'ACCEPTED',
      },
    });
  } catch (e) {
    try {
      completed = await prisma.userFriend.update({
        where: {
          userId_friendId: {
            userId: input.friendId,
            friendId: input.userId,
          },
        },
        data: {
          status: 'ACCEPTED',
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
};
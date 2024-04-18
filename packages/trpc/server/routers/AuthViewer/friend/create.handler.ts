import { TCreateFriendInput } from './create.schema';
import { Context } from '@trivai/trpc/server/context';
import { TRPCError } from '@trivai/trpc/server';

type FriendOptions = {
  ctx: Context;
  input: TCreateFriendInput;
};


export const create = async ({ ctx, input }: FriendOptions) => {
  const { prisma } = ctx;
  let friend = await prisma.user.findUnique({
    where: {
      userName: input.friendUsername,
    },
    select: {
      id: true,
    }
  });
  if (!friend || !friend.id) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Friend not found',
    });
  }
  const isAlreadyFriend = await prisma.userFriend.findFirst({
    where: {
      userId: input.userId,
      friendId: friend.id,
    }
  });
  const isAlreadyRequested = await prisma.userFriend.findFirst({
    where: {
      userId: friend.id,
      friendId: input.userId,
    }
  });
  if (isAlreadyRequested) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: "Already friends or request pending",
    });
  }
  if (isAlreadyFriend) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: "Already friends or request pending",
    });
  }
  return await prisma.userFriend.create({
    data: {
      userId: input.userId,
      friendId: friend.id,
    },
  });
};
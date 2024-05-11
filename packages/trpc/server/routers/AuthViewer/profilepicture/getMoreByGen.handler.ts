import { Context } from '@trivai/trpc/server/context';
import { TRPCError } from '@trivai/trpc/server';
import { getPrismaErrorDescription } from '@trivai/prisma';
import { TGetMoreByGen } from './getMoreByGen.schema';

type GetMoreByGenHandlerProps = {
  ctx: Context;
  input: TGetMoreByGen;
};

export const getMoreByGen = async ({ ctx, input }: GetMoreByGenHandlerProps) => {
  const { prisma } = ctx;
  const { take, skip } = input;
  const profilePictures = await prisma.profilePicture.findMany({
    where: {
      gen: input.gen,
    },
    take,
    skip,
  });
  return profilePictures;
};

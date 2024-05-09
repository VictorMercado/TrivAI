import { Context } from '@trivai/trpc/server/context';
import { TGetRoomsInput } from './getRooms.schema';
import { TRPCError } from '@trivai/trpc/server';

type GetRoomsOptions = {
  ctx: Context;
  input: TGetRoomsInput;
};

export const getRooms = async ({ctx, input} : GetRoomsOptions) => {
  const { prisma } = ctx;
  let rooms; 
  try {
    rooms = await prisma.room.findMany({
      where: {
        quizId: input.quizId,
      },
      select: {
        id: true,
        quizId: true,
        roomId: true,
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Error fetching rooms",
    });
  }
  return rooms;
};

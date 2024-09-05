import { Context } from "@trivai/trpc/server/context";
import { TGetAllByUserIdInput } from './getAllByUserId.schema';

type GetAllByUserIdOptions = {
  ctx: Context;
  input: TGetAllByUserIdInput;
};

export const getAllByUserId = ({ ctx, input }: GetAllByUserIdOptions) => {
  const { prisma, session } = ctx;
  if (!session) {
    throw new Error("No session");
  }
  if(session.user?.id !== input.userId) {
    throw new Error("Unauthorized");
  }
  return prisma.quiz.findMany({
    where: {
      ownerId: input.userId,
    },
  });
}
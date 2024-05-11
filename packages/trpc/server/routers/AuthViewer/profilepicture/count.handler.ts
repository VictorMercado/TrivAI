import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";

type GetCountOptions = {
  ctx: Context;
};


export const count = async ({ ctx }: GetCountOptions) => {
  const { prisma, session } = ctx;
  let count;
  try {
    count = await prisma.profilePicture.count();
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  }
  return count;
};
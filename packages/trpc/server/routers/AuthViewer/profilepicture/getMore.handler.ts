import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trivai/trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TGetMoreInput } from "./getMore.schema";

type GetMoreOptions = {
  ctx: Context;
  input: TGetMoreInput;
};


export const getMore = async ({ ctx, input }: GetMoreOptions) => {
  const { prisma } = ctx;
  const { take, skip } = input;
  let profilePictures;
  try {
    profilePictures = await prisma.profilePicture.findMany({
      take: take,
      skip: skip,
    });
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  }
  return profilePictures;
};
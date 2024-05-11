import { getPrismaErrorDescription } from "@trivai/prisma";
import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trpc/server";
import { TBuyInput } from "./buy.schema";

type BuyOptions = {
  ctx: Context;
  input: TBuyInput;
}

// TODO: MAKE IDEMPOTENT 
export const buy = async ({ ctx, input }: BuyOptions) => {
  const { prisma, session } = ctx;
  let profilePicture;
  let user;
  if (input.userId !== session?.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED"
    });
  }
  try {
    user = await prisma.user.findUnique({
      where: {
        id: input.userId
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });
  }
  try {
    profilePicture = await prisma.profilePicture.findUnique({
      where: {
        id: input.profilePictureId,
      }
    });
  } catch (e) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Profile Picture Not Found",
    });
  }
  if (user!.credits < profilePicture!.cost) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Insufficient Funds",
    });
  }
  await prisma.userProfilePicture.create({
    data: {
      userId: input.userId,
      profilePictureId: input.profilePictureId,
    }
  });
  await prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      credits: user!.credits - profilePicture!.cost,
    }
  });
}
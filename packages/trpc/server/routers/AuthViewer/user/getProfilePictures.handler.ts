import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TGetProfilePictures } from "./getProfilePictures.schema";

type GetProfilePicturesOptions = {
  ctx: Context;
  input: TGetProfilePictures;
};

export const getProfilePictures = async ({ ctx, input }: GetProfilePicturesOptions) => {
  const { prisma, session } = ctx;
  let profilePictures;
  try {
    profilePictures = await prisma.userProfilePicture.findMany({
      where: {
        userId: input.userId,
      },
      select: {
        profilePicture: true,
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  }
  return profilePictures;
};
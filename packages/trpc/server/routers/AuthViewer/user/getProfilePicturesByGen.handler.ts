import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trpc/server";
import { getPrismaErrorDescription } from "@trivai/prisma";
import { TGetProfilePicturesByGen } from "./getProfilePicturesByGen.schema";

type GetProfilePicturesByGenOptions = {
  ctx: Context;
  input: TGetProfilePicturesByGen;
};

export const getProfilePicturesByGen = async ({ ctx, input }: GetProfilePicturesByGenOptions) => {
  const { prisma, session } = ctx;
  const { take, skip } = input;
  let profilePictures; 
  try {
    if (input.userId) {
      profilePictures = await prisma.userProfilePicture.findMany({
        where: {
          userId: input.userId,
        },
        take,
        skip,
      });
    } else {
      profilePictures = await prisma.userProfilePicture.findMany({
        where: {
          userId: session?.user.id,
        },
        take,
        skip,
      });
    }
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: getPrismaErrorDescription(e),
    });
  }
  return profilePictures;
};
import { Context } from "@trivai/trpc/server/context";
import { TRPCError } from "@trivai/trpc/server";
import { TGetInput } from "./get.schema";

type GetOptions = {
  ctx: Context;
  input: TGetInput;
};

export const get = async ({ ctx, input }: GetOptions) => {
  const { prisma } = ctx;
  const { id } = input;
  let profilePicture;
  try {
    profilePicture = await prisma.profilePicture.findUnique({
      where: {
        id: id,
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Profile Picture Not Found",
    });
  }
  return profilePicture;
};
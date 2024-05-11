import { Prisma } from "@prisma/client";
import { prisma } from "@trivai/prisma";


export type ProfilePicture = Prisma.PromiseReturnType<typeof getProfilePicture>;

export async function getProfilePicture(id: number) {
  return await prisma.profilePicture.findUnique({
    where: { id },
  });
}

export async function getProfilePicturesByQuantity(take: number, skip: number) {
  return await prisma.profilePicture.findMany({
    take: take,
    skip: skip,
  });
}
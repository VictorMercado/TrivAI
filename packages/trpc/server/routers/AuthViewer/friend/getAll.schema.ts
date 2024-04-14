import { Prisma } from "@trivai/prisma";

// Prisma.validator<Prisma.UserSelect>;

export type TGetAllFriendInput = {};

export const ViewSelectGetAllFriend = {
  id: true,
  name: true,
  userName: true,
  image: true,
  prize: true,
  totalScore: true,
  credits: true,
};

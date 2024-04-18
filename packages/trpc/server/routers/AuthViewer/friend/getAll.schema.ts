import { Prisma } from "@trivai/prisma";

// Prisma.validator<Prisma.UserSelect>;
export type Friend = {
  id: string;
  name: string;
  userName: string;
  image: string;
  prize: string;
  totalScore: number;
  credits: number;
};

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

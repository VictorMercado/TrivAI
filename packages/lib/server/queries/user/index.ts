import { Prisma } from "@prisma/client";
import { prisma } from '@trivai/prisma';
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";

export type UserState = {
  id: string;
  name: string;
  totalScore: number;
  image: string;
  cheatUsed: boolean;
  primaryColor?: string;
  credits: number;
  creditsMultiplier: number;
}

export const getUser = async () => {
  let dbUser;
  const currentUser = await getCurrentUser();
  if (currentUser) {
    try {
      dbUser = (await prisma.user.findUnique({
        where: {
          id: currentUser?.id,
        },
        select: {
          id: true,
          name: true,
          totalScore: true,
          cheatUsed: true,
          image: true,
          credits: true,
          primaryColor: true,
          creditsMultiplier: true,
        },
      })) as UserState;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("no dbUser from layout");
  }
  return dbUser;
};

export const updateUserName = async (userId: string, userName: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { userName: userName },
  });
}

export const getUserRole = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role;
}

type UserSelectObject = {
  id?: boolean;
  userName?: boolean;
  role?: boolean;
  name?: boolean;
  email?: boolean;
  image?: boolean;
  credits?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  totalScore?: boolean;
  allegiance?: boolean;
};

export async function getUserWithProperties(userQuery: { userId: string; properties: Array<keyof UserSelectObject>; }) {
  const userSelectObject: UserSelectObject = userQuery.properties.reduce((acc, curr) => {
    Object.defineProperty(acc, curr, { value: true, enumerable: true });
    return acc;
  }, {});

  const user = await prisma.user.findFirst({
    where: { id: userQuery.userId },
    select: userSelectObject,
  });
  return user;
}

export type Users = Prisma.PromiseReturnType<typeof getUsers>;
export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: false,
      userName: true,
      role: true,
      cheatUsed: true,
      totalScore: true,
      image: true,
      primaryColor: true,
    },
  });
}
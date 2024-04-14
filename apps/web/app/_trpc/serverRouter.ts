import { prisma } from "@trivai/prisma";
import { createCallerApp } from "@trivai/trpc/server/routers/_app";
import { getSession } from "@trivai/auth/lib/getSession";

export const serverRouter = async () => {
  const session = await getSession();
  return createCallerApp({ session, prisma });
};

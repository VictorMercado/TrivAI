import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@trivai/auth/lib/next-auth-options";
import { prisma } from '@trivai/prisma';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext() {
  const session = await getServerSession(authOptions);
  return {
    session,
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
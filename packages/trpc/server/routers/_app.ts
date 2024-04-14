import { z } from 'zod';
import { publicProcedure, router, createCallerFactory, mergeRouters } from '../trpc';
import { authViewerRouter } from './AuthViewer/_router';

export const appRouter = mergeRouters(router({
  authViewer: authViewerRouter,
  userList: publicProcedure.query(async (opts) => {
    const { input, ctx } = opts;
    const { prisma } = ctx;
    return await prisma.user.findMany();
  }),
  userById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input, ctx } = opts;
    const { prisma, session } = ctx;

    return await prisma.user.findUnique({
      where: { id: input },
    });
  }),
}));

export const createCallerApp = createCallerFactory(appRouter);

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
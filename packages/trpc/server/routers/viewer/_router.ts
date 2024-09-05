import { mergeRouters, router } from "../../trpc";
import { userRouter } from './user/_router';

export const viewerRouter = mergeRouters(
  router({
    user: userRouter,
  }),
);
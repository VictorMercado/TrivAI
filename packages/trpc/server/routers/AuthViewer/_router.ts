import { mergeRouters, router } from "../../trpc";
import { categoryRouter } from './category/_router';
import { themeRouter } from './themes/_router';
import { friendRouter } from './friend/_router';
import { quizRouter } from "./quiz/_router";

export const authViewerRouter = mergeRouters(
  router({
    category: categoryRouter,
    theme: themeRouter,
    friend: friendRouter,
    quiz: quizRouter,
  }),
);
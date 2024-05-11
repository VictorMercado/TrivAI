import { mergeRouters, router } from "../../trpc";
import { categoryRouter } from './category/_router';
import { themeRouter } from './themes/_router';
import { friendRouter } from './friend/_router';
import { quizRouter } from "./quiz/_router";
import { userRouter } from "./user/_router";
import { questionRouter } from "./question/_router";
import { profilePictureRouter } from "./profilepicture/_router";

export const authViewerRouter = mergeRouters(
  router({
    category: categoryRouter,
    theme: themeRouter,
    friend: friendRouter,
    quiz: quizRouter,
    user: userRouter,
    question: questionRouter,
    profilePicture: profilePictureRouter,
  }),
);
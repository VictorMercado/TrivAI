import { serverRouter } from "@/app/_trpc/serverRouter";
import { Board } from "./Board";
import { Suspense } from "react";
import type { GetAllCategories } from "@trivai/trpc/server/routers/AuthViewer/category/getAll.handler";
const AIURL = process.env.AI_API_URL || "";


// user quizzes will be passed down to the Dashboard component
const ServerBoard = async () => {
  const router = await serverRouter();
  const categories = await router.authViewer.category.getAll();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Board categories={categories} aiUrl={AIURL} />
    </Suspense>
  );
};

export { ServerBoard };
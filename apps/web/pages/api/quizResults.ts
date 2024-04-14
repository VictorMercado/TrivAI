import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";
import { mergeQuizzesWithAnswers } from "@trivai/lib/server/queries/quiz/helpers";
import { getSessionWithReqRes } from "@trivai/auth/lib/getSessionWithReqRes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getSessionWithReqRes(req, res);
  console.log("quizresults api running");
  res.status(200).json({message : "Hello World"});
  return;
}
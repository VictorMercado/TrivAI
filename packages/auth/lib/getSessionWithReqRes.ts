import { getServerSession } from "next-auth/next";
import { authOptions } from "@trivai/auth/lib/next-auth-options";

export async function getSessionWithReqRes(req: any, res: any) {
  return await getServerSession(req, res, authOptions);
}
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";
import { getSessionWithReqRes } from "@trivai/auth/lib/getSessionWithReqRes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getSessionWithReqRes(req, res);
    if (session) {
        if (req.method == 'DELETE') {
            let query = req.query;
            let userId = query.userId as string;
            if (session.user?.id == userId) {
                await prisma.user.findFirst({
                    where: {
                        id: userId
                    }
                });
                console.log(userId);
                await prisma.user.delete({
                    where: {
                        id: userId
                    }
                });
                res.status(200).json({ message: "Success" });
                return;
            } else {
                res.status(403).json({ message: "Forbidden" });
                return;
            }
        }
    }
    res.status(403).json({ message: "Forbidden" });
    return;
}
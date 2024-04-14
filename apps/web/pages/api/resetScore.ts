import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";
import { getSessionWithReqRes } from "@trivai/auth/lib/getSessionWithReqRes";

// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getSessionWithReqRes(req, res);
    console.log("reset running");
    
    if (session) {
        if (req.method == 'PUT') {
            let { id, totalScore } = req.body;
            await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    totalScore: parseInt(totalScore)
                }
            });
            res.status(200).json({ message: "Success", totalScore: totalScore });
            return;
        }
    }
    res.status(403).json({ message: "Forbidden" });
}
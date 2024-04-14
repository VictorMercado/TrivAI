import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@trivai/prisma';
import type { Session } from "next-auth";
import { getSessionWithReqRes } from "@trivai/auth/lib/getSessionWithReqRes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getSessionWithReqRes(req, res);
    if (session) {
        if (req.method == 'PUT') {
            let { id, totalScore } = req.body;
            console.log(req.body);
            console.log(id, totalScore);
            // await prisma.user.update({
            //     where: {
            //         id: id
            //     },
            //     data: {
            //         totalScore: parseInt(totalScore)
            //     }
            // });
            res.status(200).json({ message: "Success", totalScore: totalScore });
            return;
        }
    }
    res.status(403).json({ message: "Forbidden" });
}
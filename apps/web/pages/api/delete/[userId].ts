import { authOptions } from "@/src/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions);
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
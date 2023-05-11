import { authOptions } from "@/src/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { db } from "@/src/db";

// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session : Session | null = await getServerSession(req, res, authOptions);
    if (session) {
        if (session.user.email === "zenprod123@gmail.com") {
            if (req.method == 'GET') {
                    await db.user.updateMany({
                        data: {
                            role: "ADMIN"
                        }
                    });
                res.status(200).json({message: "Success",});
                return;
            }
        }
        res.status(403).json({message: "Forbidden"});
        return;
    }
    res.status(403).json({message: "Forbidden"});
}
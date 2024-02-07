import { authOptions } from "@/src/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { prisma } from "@trivai/prisma";

// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions);

    if (session) {
        if (session.user.role === "ADMIN") {
            try {
                if (req.method === "POST") {
                    let { id, basePrompt, category, isActive, sdPrompt } = req.body;
                    const response = await prisma.quizCategory.findFirst({
                        where: {
                            id: parseInt(id ? id : "0")
                        }
                    });
                    if (response) {
                        await prisma.quizCategory.update({
                            where: {
                                id: parseInt(id)
                            },
                            data: {
                                basePrompt: basePrompt,
                                category: category,
                                sdPrompt: sdPrompt,
                                isActive: isActive ? (isActive === 'true') : undefined
                            }
                        });
                    } else {
                        await prisma.quizCategory.create({
                            data: {
                                basePrompt: basePrompt,
                                category: category,
                                sdPrompt: sdPrompt,
                            }
                        });
                    }
                    res.status(200).json({ message: "Success" });
                    return;
                }
                if (req.method === "DELETE") {
                    let id = req.query.id as string;
                    let response = await prisma.quizCategory.findFirst({
                        where: {
                            id: parseInt(id)
                        }
                    });
                    if (response) {
                        await prisma.quizCategory.delete({
                            where: {
                                id: parseInt(id)
                            }
                        });
                    } else {
                        res.status(404).json({ message: "Not Found" });
                        return;
                    }
                    res.status(200).json({ message: "Success" });
                    return;
                }
                res.status(405).json({ message: "Method Not Allowed" });
                return;
            } catch (e) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

    }
    res.status(403).json({ message: "Forbidden" });
}
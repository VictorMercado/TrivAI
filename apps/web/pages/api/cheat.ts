import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { prisma } from '@trivai/prisma';

type Cheat = {
    id: string;
    cheatUsed: boolean;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Cheat>
) {
    switch (req.method) {
        case 'PUT': {
            let data: Cheat = req.body;
            const { id, cheatUsed } = await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    cheatUsed: true
                }
            });
            res.status(200).json({ id, cheatUsed });
            break;
        }
        default: {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
        }
    }
}
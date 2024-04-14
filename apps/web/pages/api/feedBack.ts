import { prisma } from '@trivai/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(422).json({ message: 'Invalid input.' });
    }

    await prisma.feedback.create({
        data: {
            name,
            message
        }
    });
    res.status(201).json({ message: 'success', feedback: message });
}
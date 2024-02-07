import { prisma } from '@trivai/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(422).json({ message: 'Invalid input.' });
    }

    const newFeedback = await prisma.feedback.create({
        data: {
            name,
            email,
            message
        }
    });
    res.status(201).json({ message: 'success', feedback: message });
}
import crypto from 'crypto';
import { encrypt } from "@trivai/auth/lib/encrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@trivai/auth/lib/next-auth-options';
import { prisma } from '@trivai/prisma';

export async function GET(request: Request, response: Response) {
  // this route will set a cookie with the a merged users id and a generated token
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: 'No session' }), { status: 401 });
  }
  const token = crypto.randomBytes(16).toString('hex');
  const userId = session.user.id;
  try {
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
      }
    });
    await prisma.session.create({
      data: {
        userId: userId,
        sessionToken: token,
        expires: new Date(Date.now() + 1209600), // 14 days
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
  }

  const userIdToken = `${userId}-${token}`;
  if (!process.env.TOKEN_SECRET) {
    return new Response(JSON.stringify({ message: 'env not set', error: true }), { status: 400 });
  }
  const encryptedToken = encrypt(userIdToken, process.env.TOKEN_SECRET);

  // const cookie = `userToken=${session.user.id}-${token}; path=/; domain=localhost; max-age=3600; httponly; samesite=Lax;`;
  const cookie = `userToken=${encryptedToken}; path=/; domain=localhost; max-age=3600; httponly; samesite=Lax;`;
  return new Response(JSON.stringify({ message: 'Cookie set' }), {
    status: 200,
    headers: {
      'Set-Cookie': cookie,
      'Content-Type': 'application/json',
    },
  });
} 
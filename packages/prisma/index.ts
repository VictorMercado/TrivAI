import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prismaCl: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prismaCl = new PrismaClient();
  // prisma = new PrismaClient({log: ['query'],});
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
    // global.cachedPrisma = new PrismaClient({log: ['query'],});
  }
  prismaCl = global.cachedPrisma;
}

export const prisma = prismaCl;
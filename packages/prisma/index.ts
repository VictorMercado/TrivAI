import { Prisma, PrismaClient } from "@prisma/client";

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
export { Prisma };

export const getPrismaErrorDescription = (error : any) => {
  if (error.code === 'P2002') {
    return 'Unique constraint violation. This value already exists.';
  } else if (error.code === 'P2003') {
    return 'Foreign key constraint violation.';
  } else if (error.code === 'P2004') {
    return 'The required relation was not found.';
  } else if (error.code === 'P2000') {
    return 'The record you are trying to update or delete does not exist.';
  } else {
    return 'An unknown error occurred.';
  }
}

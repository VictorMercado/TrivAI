import { Context } from "@trivai/trpc/server/context";
import { Prisma } from "@trivai/prisma";

type GetCategoryOptions = {
  ctx: Context;
};

export const getAll = async ({ ctx }: GetCategoryOptions) => {
  const { prisma, session } = ctx; 
  return await prisma.category.findMany({
    where: {
      userId: session!.user.id,
    },
    select: {
      id: true,
      name: true,
      theme: {
        select: {
          id: true,
          name: true,
          quizLength: true,
          daysLength: true,
          category: {
            select: {
              id: true,
              name: true,
            }
          }
        },
      },
    }
  });
};

export type GetAllCategories = Prisma.PromiseReturnType<typeof getAll>;
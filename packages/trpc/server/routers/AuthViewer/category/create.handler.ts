import { TCreateCategoryInput } from './create.schema';
import { Context } from "@trivai/trpc/server/context";
import { getPrismaErrorDescription } from "@trivai/prisma";

type CreateOptions = {
  ctx: Context;
  input: TCreateCategoryInput;
};

export const create = async ({ ctx, input }: CreateOptions) => {
  const { prisma, session } = ctx;
  if (session!.user.id !== input.userId) throw new Error('Unauthorized');

  let category; 
  try {
    category = await prisma.category.create({
      data: {
        name: input.name.toUpperCase(),
        userId: input.userId,
      },
    });
  } catch (e) {
    throw new Error(getPrismaErrorDescription(e));
  }
  return category;
};
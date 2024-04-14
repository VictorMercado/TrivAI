import { Context } from "@trivai/trpc/server/context";
import { TDeleteCategoryInput } from "./delete.schema";

type GetCategoryOptions = {
  ctx: Context;
  input: TDeleteCategoryInput;
};

export const deleteCategory = async ({ ctx, input }: GetCategoryOptions) => {
  const { prisma, session } = ctx;
  const category = await prisma.category.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!category) throw new Error('Category not found');
  if (category.userId !== session!.user.id) throw new Error('Unauthorized');
  return await prisma.category.delete({
    where: {
      id: input.id,
    },
  });
};

import { Context } from '@trivai/trpc/server/context';
import { TDeleteThemeInput } from './delete.schema';

type GetThemeOptions = {
  ctx: Context;
  input: TDeleteThemeInput;
};

export const deleteTheme = async ({ ctx, input }: GetThemeOptions) => {
  const { prisma, session } = ctx;
  const theme = await prisma.theme.findUnique({
    where: {
      id: input.id,
    },
    select: {
      category: {
        select: {
          userId: true,
        },
      }
    }
  });
  if (!theme) throw new Error('Theme not found');
  if (theme.category.userId !== session!.user.id) throw new Error('Unauthorized');
  return await prisma.theme.delete({
    where: {
      id: input.id,
    },
  });
};

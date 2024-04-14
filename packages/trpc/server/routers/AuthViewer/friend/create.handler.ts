import { TCreateFriendInput } from './create.schema';


type FriendOptions = {
  ctx: any;
  input: TCreateFriendInput;
};


export const create = async ({ ctx, input }: FriendOptions) => {
  const { prisma } = ctx;
  let friend;
  try {
    friend = await prisma.user.findUnique({
      where: {
        userName: input.friendUsername,
      },
      select: {
        id: true,
      }
    });
  } catch (e) {
    console.error(e);
  }
  return await prisma.userFriend.create({
    data: {
      userId: input.userId,
      friendId: friend.id,
    },
  });
}
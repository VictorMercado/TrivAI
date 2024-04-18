import { protectedProcedure, router } from "../../../trpc";

import { getAll } from './getAll.handler';
import { getPending } from './getPending.handler';
import { getRequested } from './getRequested.handler';


import { create } from './create.handler';
import { ZCreateFriendInput } from './create.schema';

import { acceptRequest } from "./acceptRequest.handler";
import { ZAcceptRequestInput } from './acceptRequest.schema';

import { declineRequest } from "./declineRequest.handler";
import { ZDeclineRequestInput } from "./declineRequest.schema";

import { cancelRequest } from "./cancelRequest.handler";
import { ZCancelRequestInput } from "./cancelRequest.schema";

import { deleteFriend } from "./delete.handler";
import { ZDeleteFriendInput } from "./delete.schema";

export const friendRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getAll({ ctx });
  }),
  getPending: protectedProcedure.query(async ({ ctx }) => {
    return await getPending({ ctx });
  }),
  getRequested: protectedProcedure.query(async ({ ctx }) => {
    return await getRequested({ ctx });
  }),
  create: protectedProcedure.input(ZCreateFriendInput).mutation(async ({ input, ctx }) => {
    return await create({ ctx, input });
  }),
  acceptRequest: protectedProcedure.input(ZAcceptRequestInput).mutation(async ({ input, ctx }) => {
    return await acceptRequest({ ctx, input });
  }),
  declineRequest: protectedProcedure.input(ZDeclineRequestInput).mutation(async ({ input, ctx }) => {
    return await declineRequest({ ctx, input });
  }),
  cancelRequest: protectedProcedure.input(ZCancelRequestInput).mutation(async ({ input, ctx }) => {
    return await cancelRequest({ ctx, input });
  }),
  delete: protectedProcedure.input(ZDeleteFriendInput).mutation(async ({input, ctx}) => {
    return await deleteFriend({ctx, input});
  }),
});



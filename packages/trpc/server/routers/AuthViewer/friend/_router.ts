import { protectedProcedure, router } from "../../../trpc";
import { getAll } from './getAll.handler';
import { create } from './create.handler';
import { getPending } from './getPending.handler';
import { getRequested } from './getRequested.handler';

import { TGetAllFriendInput } from './getAll.schema';
import { ZCreateFriendInput } from './create.schema';
import { ZAcceptRequestInput } from './acceptRequest.schema';
import { acceptRequest } from "./acceptRequest.handler";

export const friendRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getAll({ ctx });
  }),
  create: protectedProcedure.input(ZCreateFriendInput).mutation(async ({ input, ctx }) => {
    return await create({ ctx, input });
  }),
  getPending: protectedProcedure.query(async ({ ctx }) => {
    return await getPending({ ctx });
  }),
  getRequested: protectedProcedure.query(async ({ ctx }) => {
    return await getRequested({ ctx });
  }),
  acceptRequest: protectedProcedure.input(ZAcceptRequestInput).mutation(async ({ input, ctx }) => {
    return await acceptRequest({ ctx, input });
  }),
});



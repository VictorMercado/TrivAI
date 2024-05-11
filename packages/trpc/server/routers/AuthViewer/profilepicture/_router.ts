import { router, protectedProcedure } from "@trivai/trpc/server/trpc";

import { get } from "./get.handler";
import { ZGetInput } from "./get.schema";
import { getMore } from "./getMore.handler";
import { ZGetMoreInput } from "./getMore.schema";
import { buy } from "./buy.handler";
import { ZBuyInput } from "./buy.schema";
import { count } from "./count.handler";
import { getMoreByGen } from "./getMoreByGen.handler";
import { ZGetMoreByGen } from "./getMoreByGen.schema";

export const profilePictureRouter = router({
  get: protectedProcedure.input(ZGetInput).query(async ({ctx, input}) => {
    return await get({ctx, input});
  }),
  getMore: protectedProcedure.input(ZGetMoreInput).query(async ({ctx, input}) => {
    return await getMore({ctx, input});
  }),
  getMoreByGen: protectedProcedure.input(ZGetMoreByGen).query(async ({ctx, input}) => {
    return await getMoreByGen({ctx, input});
  }),
  buy: protectedProcedure.input(ZBuyInput).mutation(async ({ctx, input}) => {
    return await buy({ctx, input});
  }),
  count: protectedProcedure.query(async ({ctx}) => {
    return await count({ctx});
  }),
});
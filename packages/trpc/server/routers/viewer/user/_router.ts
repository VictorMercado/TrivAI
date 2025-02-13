import { publicProcedure, router } from "@trivai/trpc/server/trpc";
import { getProfilePictures } from "./getProfilePictures.handler";
import { ZGetProfilePictures } from "./getProfilePictures.schema";

export const userRouter = router({
  getProfilePictures: publicProcedure.input(ZGetProfilePictures).query(async ({ ctx, input }) => {
    return await getProfilePictures({ ctx, input });
  }),
});
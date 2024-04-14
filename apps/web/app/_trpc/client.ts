import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@trivai/trpc/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>({});
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { publicProcedure, router } from "./src/trpc";
import cors from "cors";
import { createContext } from "./src/context";

import { userRouter } from "./src/routers/user";

const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors({
    origin: "*",
  }),
  router: appRouter,
  createContext,
});

server.listen(4000);

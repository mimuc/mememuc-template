import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { publicProcedure, router } from "./src/trpc";
import cors from "cors";
import { createContext } from "./src/context";

import { userRouter } from "./src/routers/user";
import { templateRouter } from "./src/routers/template";

const appRouter = router({
  user: userRouter,
  template: templateRouter,
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

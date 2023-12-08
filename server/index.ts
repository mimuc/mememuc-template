import { createHTTPServer } from "@trpc/server/adapters/standalone";

import { router } from "./src/trpc";
import cors from "cors";
import { createContext } from "./src/context";

import { memeRouter } from "./src/routers/meme";
import { userRouter } from "./src/routers/user";
import { templateRouter } from "./src/routers/template";

const appRouter = router({
  meme: memeRouter,
  template: templateRouter,
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

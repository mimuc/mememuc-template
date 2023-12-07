import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../,,/../../../server";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000",
    }),
  ],
});

export function getUserTemplates(user: string, origin?: "upload" | "camera") {
  console.log("getUserTemplates", client);
  return client.user.getUserTemplates.query({ username: user, origin });
}

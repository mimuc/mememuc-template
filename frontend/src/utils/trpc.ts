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
  return client.user.getUserTemplates.query({ username: user, origin });
}

export function uploadUserTemplate(
  user: string,
  name: string,
  base64: string,
  origin: "upload" | "camera",
) {
  return client.user.uploadTemplate.mutate({
    username: user,
    origin,
    name,
    base64,
  });
}

export function deleteUserTemplate(user: string, id: string) {
  return client.user.deleteTemplate.mutate({ username: user, id });
}

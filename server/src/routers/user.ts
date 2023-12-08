import { z } from "zod";
import { ObjectId } from "bson";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    const users = ctx.prisma.users.findMany().then((users) => users);
    return users;
  }),
  getUserByName: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.users
        .findFirst({
          where: { username: input.username },
        })
        .then((user) => user);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),
  getUserTemplates: publicProcedure
    .input(
      z.object({
        username: z.string(),
        origin: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("getUserTemplates", input);

      const user = await ctx.prisma.users
        .findFirst({
          where: { username: input.username },
        })
        .then((user) => user);

      if (!user) {
        throw new Error("User not found");
      }

      const templates = user.templates.filter((template) => {
        return input.origin ? template.origin === input.origin : true;
      });

      return templates;
    }),
  uploadTemplate: publicProcedure
    .input(
      z.object({
        username: z.string(),
        origin: z.string(),
        name: z.string(),
        base64: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.users
        .findFirst({
          where: { username: input.username },
        })
        .then((user) => user);

      if (!user) {
        throw new Error("User not found");
      }

      const id = new ObjectId().toHexString();

      await ctx.prisma.users
        .update({
          where: { id: user.id },
          data: {
            templates: {
              push: {
                id,
                name: input.name,
                origin: input.origin,
                base64: input.base64,
              },
            },
          },
        })
        .catch((err) => {
          console.log("uploadTemplate", err);
        });

      return id;
    }),
  deleteTemplate: publicProcedure
    .input(
      z.object({
        username: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.users
        .findFirst({
          where: { username: input.username },
        })
        .then((user) => user);

      if (!user) {
        throw new Error("User not found");
      }

      const index = user.templates.findIndex(
        (t) => t.id.toString() === input.id,
      );
      if (index === -1) {
        throw new Error("Template not found");
      }

      user.templates.splice(index, 1);

      await ctx.prisma.users
        .update({
          where: { id: user.id },
          data: {
            templates: user.templates,
          },
        })
        .catch((err) => {
          console.log("deleteTemplate", err);
        });

      return;
    }),
});

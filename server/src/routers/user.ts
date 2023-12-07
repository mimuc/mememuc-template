import { z } from "zod";
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

      const templates = user.templates
        .filter((template) => {
          return input.origin ? template.origin === input.origin : true;
        })
        .map((template) => {
          return {
            id: template.id,
            name: template.name,
            origin: template.origin,
          };
        });

      return templates;
    }),
  // uploadTemplate: publicProcedure
  //   .input(
  //     z.object({
  //       username: z.string(),
  //       file: z.any(),
  //       origin: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const user = await ctx.then((c) =>
  //       c.prisma.users.findFirst({
  //         where: { username: input.username },
  //       }),
  //     );

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     const template = await ctx.then((c) =>
  //       c.prisma.templates.create({
  //         data: {
  //           name: input.file.originalname,
  //           type: input.file.mimetype,
  //           image: input.file.buffer.toString("base64"),
  //           origin: input.origin,
  //           user: {
  //             connect: {
  //               id: user.id,
  //             },
  //           },
  //         },
  //       }),
  //     );
  //   }),
});

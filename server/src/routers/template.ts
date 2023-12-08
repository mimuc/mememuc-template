import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const templateRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    const templates = ctx.prisma.templates.findMany().then((templates) =>
      templates.map((template) => ({
        id: template.id,
        name: template.name,
      })),
    );
    return templates;
  }),
  getSrc: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const src = ctx.prisma.templates
        .findUnique({
          where: {
            id: input.id,
          },
        })
        .then((template) => {
          const base64 = "data:image/jpg;base64," + template?.image;
          return base64;
        });
      return src;
    }),
});

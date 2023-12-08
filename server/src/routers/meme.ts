import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const memeRouter = router({
  save: publicProcedure
    .input(
      z.object({
        username: z.string(),
        base64: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const meme = await ctx.prisma.memes.create({
        data: {
          user: input.username,
          base64: input.base64,
        },
      });

      return meme;
    }),
});

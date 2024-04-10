import { z } from "zod";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { categories } from "~/shared";

export const userRouter = createTRPCRouter({
  getByCategory: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          category: categories.find((c) => c.id === input.id)?.value
        }
      })
    }),
});

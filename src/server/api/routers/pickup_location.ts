import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  authenticatedProcedure
} from "~/server/api/trpc";

export const pickupPointRouter = createTRPCRouter({
  getAll: authenticatedProcedure
    .query(({ ctx }) => {
      return ctx.db.pickupPoint.findMany()
    }),
  create: adminProcedure.input(z.object({
    adress: z.string(),
    schedule: z.string(),
    coordX: z.coerce.number(),
    coordY: z.coerce.number(),
  })).mutation(({ ctx, input }) => {
    return ctx.db.pickupPoint.create({
      data: {
        ...input
      }
    })
  }),
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.pickupPoint.delete({
        where: {
          id: input.id
        }
      })
    })
});

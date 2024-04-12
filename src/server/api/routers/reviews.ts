import { z } from "zod";
import { Category } from "@prisma/client";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
  getOwned: authenticatedProcedure
    .query(({ ctx }) => {
      return ctx.db.review.findMany({
        where: {
          ownerId: ctx.session.user.id
        },
        include: {
          product: true
        }
      })
    }),
  create: authenticatedProcedure
    .input(z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const product = (await ctx.db.orderProduct.findMany({
        where: {
          productId: input.productId
        },
        select: {
          product: {
            select: {
              ownerId: true,
            }
          },
          Order: {
            select: {
              userId: true
            }
          }
        }
      }))[0]

      if (product?.Order.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      return ctx.db.review.create({
        data: {
          body: input.comment || "",
          rating: input.rating,
          productId: input.productId,
          userId: ctx.session.user.id,
          merchantId: product?.product.ownerId,
          ownerId: ctx.session.user.id
        }
      })
    })
})

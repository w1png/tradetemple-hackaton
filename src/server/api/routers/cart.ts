import { z } from "zod";
import { Category } from "@prisma/client";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
  getOne: authenticatedProcedure
    .input(z.object({
      product_id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.cartProduct.findUnique({
        where: {
          userId_productId: {
            userId: ctx.session.user.id,
            productId: input.product_id
          }
        },
      })
    }),
  getAll: authenticatedProcedure
    .query(({ ctx }) => {
      return ctx.db.cartProduct.findMany({
        where: {
          userId: ctx.session.user.id,
          amount: {
            gt: 0,
          }
        },
        include: {
          product: true
        }
      })
    }),
  getCount: authenticatedProcedure
    .query(async ({ ctx }) => {
      const products = await ctx.db.cartProduct.findMany({
        where: {
          userId: ctx.session.user.id,
          amount: {
            gt: 0,
          }
        },
        select: {
          amount: true,
        }
      })
      return products.reduce((acc, product) => {
        return acc + product.amount
      }, 0)
    }),
  getTotalSum: authenticatedProcedure
    .query(async ({ ctx }) => {
      const products = await ctx.db.cartProduct.findMany({
        where: {
          userId: ctx.session.user.id,
          amount: {
            gt: 0,
          }
        },
        select: {
          amount: true,
          product: {
            select: {
              price: true
            }
          }
        }
      })
      return products.reduce((acc, product) => {
        return acc + product.amount * product.product.price
      }, 0)
    }),
  increment: authenticatedProcedure
    .input((z.object({
      product_id: z.string(),
      increment: z.number(),
    })))
    .mutation(async ({ ctx, input }) => {
      if (input.increment < 0) {
        const amount = await ctx.db.cartProduct.findUnique({
          where: {
            userId_productId: {
              userId: ctx.session.user.id,
              productId: input.product_id
            },
          },
          select: {
            amount: true
          }
        })

        if (amount?.amount === 0) {
          return
        }
      }

      return ctx.db.cartProduct.upsert({
        where: {
          userId_productId: {
            userId: ctx.session.user.id,
            productId: input.product_id
          }
        },
        create: {
          userId: ctx.session.user.id,
          productId: input.product_id,
          amount: input.increment
        },
        update: {
          amount: {
            increment: input.increment
          }
        }
      })
    }),
  clearCart: authenticatedProcedure
    .mutation(async ({ ctx }) => {
      return ctx.db.cartProduct.updateMany({
        where: {
          userId: ctx.session.user.id
        },
        data: {
          amount: 0,
        }
      })
    })
})

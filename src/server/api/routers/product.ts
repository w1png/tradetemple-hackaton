import { z } from "zod";
import { Category } from "@prisma/client";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  create: authenticatedProcedure
    .input(z.object({
      name: z.string().min(1),
      price: z.number().min(1),
      category: z.nativeEnum(Category),
      images: z.array(z.string()),

      sizeX: z.number(),
      sizeY: z.number(),
      sizeZ: z.number(),
      weight: z.number(),

      description: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id
        }
      })
    }),

  getMine: authenticatedProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      where: {
        ownerId: ctx.session.user.id
      },
      include: {
        reviews: true,
      }
    })
  }),

  getOne: publicProcedure
    .input(z.object({
      id: z.string(),
    })).query(({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: {
          id: input.id
        },
        include: {
          reviews: true,
        }
      })
    }),

  getMerchant: publicProcedure
    .input(z.object({
      id: z.string(),
    })).query(async ({ ctx, input }) => {
      // get product merchant and return merchant name, profile_picutre, reviews, created_at
      const merchant = (await ctx.db.product.findUnique({
        where: {
          id: input.id
        },
        include: {
          owner: {
            include: {
              merchantReviews: true,
              products: true,
            }
          },
        }
      }))?.owner

      if (!merchant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Продавец не найден" })
      }

      return {
        id: merchant.id,
        name: merchant.name,
        avatar: merchant.image,
        reviews: merchant.merchantReviews,
        created_at: merchant.createdAt,
        products: merchant.products
      }
    })

});

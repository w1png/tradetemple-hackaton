import { z } from "zod";
import { Category } from "@prisma/client";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { categories } from "~/shared";

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
  update: authenticatedProcedure
    .input(z.object({
      id: z.string(),

      name: z.string().min(1),
      price: z.number().min(1),
      category: z.nativeEnum(Category),
      images: z.array(z.string()),

      sizeX: z.number(),
      sizeY: z.number(),
      sizeZ: z.number(),
      weight: z.number(),

      description: z.string(),
      enabled: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const ownerId = await ctx.db.product.findUnique({
        where: {
          id: input.id
        },
        select: {
          ownerId: true
        }
      })

      if (ownerId?.ownerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      return ctx.db.product.update({
        where: {
          id: input.id
        },
        data: {
          ...input
        }
      })
    }),

  getByCategory: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          category: categories.find((c) => c.id === input.id)?.value
        },
        include: {
          reviews: true
        }
      })
    }),

  getOwned: authenticatedProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      where: {
        ownerId: ctx.session.user.id
      },
      include: {
        reviews: true,
        warehouseProducts: true
      }
    })
  }),

  getOwnedWithWarehouseProducts: authenticatedProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      where: {
        ownerId: ctx.session.user.id
      },
      include: {
        reviews: true,
        warehouseProducts: true
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
          reviews: {
            include: {
              User: true
            }
          },
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
              merchantReviews: {
                include: {
                  User: true,
                }
              },
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
    }),
  delete: authenticatedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.product.findUnique({
        where: {
          id: input.id
        },
        select: {
          ownerId: true
        }
      })

      if (ctx.session.user.id !== owner?.ownerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      await ctx.db.product.delete({
        where: {
          id: input.id
        }
      })
    }),
});

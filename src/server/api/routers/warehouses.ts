import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { categories } from "~/shared";

export const warehousesRouter = createTRPCRouter({
  getOwned: authenticatedProcedure
    .query(async ({ ctx }) => {
      const warehouses = await ctx.db.warehouse.findMany({
        where: {
          ownerId: ctx.session.user.id
        },
        select: {
          id: true,
          adress: true,
          warehouseProduct: true,
          warehouseToPickupPointDistance: true,
        }
      })

      return warehouses.map((warehouse) => {
        return {
          id: warehouse.id,
          adress: warehouse.adress,
          warehouseToPickupPointDistance: warehouse.warehouseToPickupPointDistance,
          totalProducts: warehouse.warehouseProduct.reduce((acc, product) => {
            return acc + product.amount
          }, 0)
        }
      })
    }),
  create: authenticatedProcedure
    .input(z.object({
      adress: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.warehouse.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id
        }
      })
    }),
  delete: authenticatedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const ownerId = await ctx.db.warehouse.findUnique({
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

      await ctx.db.warehouse.delete({
        where: {
          id: input.id
        }
      })
    }),

  getPickupPoints: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.pickupPoint.findMany()
    }),

  update: authenticatedProcedure
    .input(z.object({
      id: z.string(),
      adress: z.string(),
      distances: z.array(z.object({
        id: z.string(),
        time: z.number(),
        distance: z.number(),
      })),
      amount: z.array(z.object({
        listing_id: z.string(),
        amount: z.number(),
      }))
    }))
    .mutation(async ({ ctx, input }) => {
      const ownerId = await ctx.db.warehouse.findUnique({
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


      await ctx.db.warehouseProduct.deleteMany({
        where: {
          warehouseId: input.id
        }
      })

      await ctx.db.warehouseToPickupPointDistance.deleteMany({
        where: {
          warehouseId: input.id
        }
      })

      await ctx.db.warehouse.update({
        where: {
          id: input.id
        },
        data: {
          adress: input.adress,
          warehouseProduct: {
            createMany: {
              data: input.amount.map((amount) => {
                return {
                  productId: amount.listing_id,
                  amount: amount.amount
                }
              })
            }
          },
          warehouseToPickupPointDistance: {
            createMany: {
              data: input.distances.map((distance) => {
                return {
                  pickupPointId: distance.id,
                  distanceKm: distance.time,
                  distanceMinutes: distance.distance
                }
              })
            }
          }
        }
      })
    }),

});

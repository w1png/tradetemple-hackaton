import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CalculateDistance, GetBestRoute, Graph } from "~/lib/distance";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { PRICE_PER_KM_RUB } from "~/shared";

const RUB_PRICE_PER_KM = 50
const RUB_PRICE_PER_CHECKPOINT = 200

export const warehousesRouter = createTRPCRouter({
  getWithProducts: publicProcedure
    .input(z.object({
      products: z.array(z.object({
        id: z.string(),
        amount: z.number(),
      })),
    }))
    .query(async ({ ctx, input }) => {
      const warehouses = await ctx.db.warehouse.findMany({
        where: {
          warehouseProduct: {
            some: {
              productId: {
                in: input.products.map((product) => product.id)
              },
            }
          }
        },
        include: {
          warehouseProduct: true
        }
      })

      return warehouses.filter((warehouse) => {
        return input.products.every((product) => {
          const warehouseProduct = warehouse.warehouseProduct.find((warehouseProduct) => warehouseProduct.productId === product.id)
          if (!warehouseProduct) {
            return false
          }
          return warehouseProduct.amount >= product.amount
        })
      })
    }),
  getRoutes: publicProcedure
    .input(z.object({
      warehouseId: z.string(),
      pickupPointId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const warehouses = await ctx.db.warehouse.findMany({
        select: {
          id: true,
          coordX: true,
          coordY: true
        }
      })
      const warehouse = warehouses.find((warehouse) => warehouse.id === input.warehouseId)
      if (!warehouse) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Склад не найден" })
      }


      const pickupPoints = await ctx.db.pickupPoint.findMany({
        select: {
          id: true,
          coordX: true,
          coordY: true
        }
      })

      const pickupPoint = pickupPoints.find((pickupPoint) => pickupPoint.id === input.pickupPointId)
      if (!pickupPoint) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Пункт выдачи не найден" })
      }

      const graph: Graph = {};
      [...warehouses, ...pickupPoints].forEach((node) => {
        graph[node.id] = {},
          [...warehouses, ...pickupPoints].forEach((neighbor) => {
            if (node.id !== neighbor.id) {
              graph[node.id]![neighbor.id] = CalculateDistance(node.coordX, node.coordY, neighbor.coordX, neighbor.coordY);
            }
          })
      })

      const fastestRoute = CalculateDistance(warehouse.coordX, warehouse.coordY, pickupPoint.coordX, pickupPoint.coordY)
      const bestRoute = GetBestRoute(input.warehouseId, input.pickupPointId, graph)

      return {
        fastestRoute: {
          distance: fastestRoute,
          price: Math.trunc(fastestRoute * RUB_PRICE_PER_KM),
        },
        bestRoute: {
          ...bestRoute,
          price: bestRoute.route.length * RUB_PRICE_PER_CHECKPOINT
        }
      }
    }),
  getOwned: authenticatedProcedure
    .query(async ({ ctx }) => {
      const warehouses = await ctx.db.warehouse.findMany({
        where: {
          ownerId: ctx.session.user.id
        },
        select: {
          id: true,
          adress: true,
          coordX: true,
          coordY: true,
          warehouseProduct: true,
        }
      })

      return warehouses.map((warehouse) => {
        return {
          id: warehouse.id,
          adress: warehouse.adress,
          coordX: warehouse.coordX,
          coordY: warehouse.coordY,
          totalProducts: warehouse.warehouseProduct.reduce((acc, product) => {
            return acc + product.amount
          }, 0)
        }
      })
    }),
  create: authenticatedProcedure
    .input(z.object({
      adress: z.string(),
      coordX: z.number(),
      coordY: z.number(),
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
      coordX: z.number(),
      coordY: z.number(),
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

      await ctx.db.warehouse.update({
        where: {
          id: input.id
        },
        data: {
          adress: input.adress,
          coordX: input.coordX,
          coordY: input.coordY,
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
        }
      })
    }),
});

import { z } from "zod";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { $Enums } from "@prisma/client";

export const orderRouter = createTRPCRouter({
  getOwned: authenticatedProcedure
    .query(({ ctx }) => {
      return ctx.db.order.findMany({
        where: {
          userId: ctx.session.user.id
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          products: {
            include: {
              product: {
                include: {
                  reviews: true
                }
              }
            }
          },
          userId: true,
          pickupPoint: true,
          deliveryType: true,
          deliveryPrice: true,
          createdAt: true,
        },
      })
    }),
  getOwnedMerchant: authenticatedProcedure
    .query(({ ctx }) => {
      return ctx.db.order.findMany({
        where: {
          merchantIds: {
            has: ctx.session.user.id
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          products: {
            where: {
              product: {
                ownerId: {
                  equals: ctx.session.user.id
                }
              }
            }
          },
          warehouse: true,
          pickupPoint: true,
          deliveryType: true,
          deliveryPrice: true,
        }
      })
    }),
  create: authenticatedProcedure
    .input(z.object({
      pickupPointId: z.string(),
      warehouseId: z.string(),
      deliveryType: z.enum(["default", "express"]),
      deliveryPrice: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const pickupPoint = await ctx.db.pickupPoint.findUnique({
        where: {
          id: input.pickupPointId,
        },
        select: {
          id: true,
        }
      })

      if (!pickupPoint) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Пункт выдачи не найден" })
      }

      const warehouse = await ctx.db.warehouse.findUnique({
        where: {
          id: input.warehouseId,
        },
        select: {
          id: true,
        }
      })

      if (!warehouse) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Склад не найден" })
      }

      const cart_products = await ctx.db.cartProduct.findMany({
        where: {
          userId: ctx.session.user.id,
          amount: {
            gt: 0
          },
        },
        include: {
          product: true
        }
      })

      if (cart_products.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Корзина пуста" })
      }

      const order = await ctx.db.order.create({
        data: {
          userId: ctx.session.user.id,
          pickupPointId: input.pickupPointId,
          deliveryType: input.deliveryType === "default" ? "DEFAULT" : "EXPRESS",
          warehouseId: input.warehouseId,
          deliveryPrice: input.deliveryPrice,
          merchantIds: cart_products.map((product) => product.product.ownerId),
          products: {
            createMany: {
              data: cart_products.map((product) => {
                return {
                  amount: product.amount,
                  name: product.product.name,
                  price: product.product.price,
                  productId: product.productId,
                }
              })
            }
          }
        }
      })

      await ctx.db.cartProduct.updateMany({
        where: {
          userId: ctx.session.user.id
        },
        data: {
          amount: 0,
        }
      })

      return order
    }),
  updateOrderStatus: authenticatedProcedure
    .input(z.object({
      orderId: z.string(),
      status: z.nativeEnum($Enums.OrderStatus)
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId,
        },
        select: {
          merchantIds: true,
          status: true
        }
      })

      if (!order || !order.merchantIds.includes(ctx.session.user.id) || (
        ["CANCELLED", "REJECTED", "RECEIVED"].includes(order.status)
      )) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Заказ не найден" })
      }

      return ctx.db.order.update({
        where: {
          id: input.orderId
        },
        data: {
          status: input.status
        }
      })
    }),
  cancelOrder: authenticatedProcedure
    .input(z.object({
      orderId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId
        },
        select: {
          userId: true,
          status: true
        }
      })

      if (!order || order.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Заказ не найден" })
      }

      if (order.status !== "REGISTERED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Нельзя отменить заказ" })
      }

      return ctx.db.order.update({
        where: {
          id: input.orderId
        },
        data: {
          status: "CANCELLED"
        }
      })
    }),
  acceptOrder: authenticatedProcedure
    .input(z.object({
      orderId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId
        },
        select: {
          userId: true,
          status: true
        }
      })

      if (!order || order.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Заказ не найден" })
      }

      if (order.status !== "DELIVERED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Нельзя принять заказ" })
      }

      return ctx.db.order.update({
        where: {
          id: input.orderId
        },
        data: {
          status: "RECEIVED"
        }
      })
    }),
  rejectOrder: authenticatedProcedure
    .input(z.object({
      orderId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId
        },
        select: {
          userId: true,
          status: true
        }
      })

      if (!order || order.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Заказ не найден" })
      }

      if (order.status !== "DELIVERED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Нельзя отказаться от заказа" })
      }

      return ctx.db.order.update({
        where: {
          id: input.orderId
        },
        data: {
          status: "REJECTED"
        }
      })
    }),
  repeatOrder: authenticatedProcedure
    .input(z.object({
      orderId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId
        },
        include: {
          warehouse: true,
          products: true,
          pickupPoint: true,
        }
      })

      if (!order || order.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Заказ не найден" })
      }

      return ctx.db.order.create({
        data: {
          userId: order.userId,
          pickupPointId: order.pickupPointId,
          deliveryType: order.deliveryType,
          warehouseId: order.warehouseId,
          deliveryPrice: order.deliveryPrice,
          merchantIds: order.merchantIds,
          products: {
            createMany: {
              data: order.products.map((product) => {
                return {
                  amount: product.amount,
                  name: product.name,
                  price: product.price,
                  productId: product.productId,
                }
              })
            }
          }
        }
      })
    }),
})

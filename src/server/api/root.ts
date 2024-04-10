import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { pickupPointRouter } from "./routers/pickup_location";
import { warehousesRouter } from "./routers/warehouses";

export const appRouter = createTRPCRouter({
  user: userRouter,
  product: productRouter,
  pickupPoint: pickupPointRouter,
  warehouse: warehousesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

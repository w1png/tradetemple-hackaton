import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { pickupPointRouter } from "./routers/pickup_location";

export const appRouter = createTRPCRouter({
  user: userRouter,
  product: productRouter,
  pickupPoint: pickupPointRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

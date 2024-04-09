import { $Enums } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: authenticatedProcedure
    .input(z.object({
      name: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  getRole: authenticatedProcedure
    .query(({ ctx }) => {
      if (ctx.session.user.email === env.MAIN_ADMIN_EMAIL) {
        return {
          role: $Enums.Role.ADMIN
        }
      }

      return ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id
        },
        select: {
          role: true
        }
      })
    })
});

import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const cardRouter = createTRPCRouter({
  updateCard: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        subTitle: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { body, id, subTitle, title } = input;
      const section = await prisma.card.update({
        where: {
          id,
        },
        data: {
          body,
          subTitle,
          title,
        },
      });
      return {
        section,
      };
    }),
});

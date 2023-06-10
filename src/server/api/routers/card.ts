import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

const defaultCardSelector = Prisma.validator<Prisma.CardSelect>()({
  id: true,
  body: true,
  subTitle: true,
  title: true,
});

export const cardRouter = createTRPCRouter({
  getCard: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const card = await prisma.card.findUnique({
        where: {
          id,
        },
        select: defaultCardSelector,
      });
      return {
        card,
      };
    }),
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

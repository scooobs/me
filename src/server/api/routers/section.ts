import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

const cardIdSelector = Prisma.validator<Prisma.CardSelect>()({
  id: true,
});

const defaultSectionSelector = Prisma.validator<Prisma.SectionSelect>()({
  id: true,
  cards: { select: cardIdSelector },
});

export const sectionRouter = createTRPCRouter({
  getSection: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const section = await prisma.section.findUnique({
        where: {
          id: input.id,
        },
        select: defaultSectionSelector,
      });
      return {
        section,
      };
    }),
});

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

const defaultCardSelection = Prisma.validator<Prisma.CardSelect>()({
  id: true,
  sectionId: true,
  title: true,
  subTitle: true,
  body: true,
});

export type CardSelectionType = typeof defaultCardSelection;

const defaultSectionSelector = Prisma.validator<Prisma.SectionSelect>()({
  id: true,
  cards: { select: defaultCardSelection },
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

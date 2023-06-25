import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type RouterOutputs } from "~/utils/api";

const defaultPostSelector = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  body: true,
  user: true,
  createdAt: true,
  updatedAt: true,
});

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure.query(async () => {
    const posts = await prisma.post.findMany({
      select: defaultPostSelector,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        visible: {
          equals: true,
        },
      },
    });
    return posts;
  }),
  getProtectedPosts: adminProcedure.query(async () => {
    const posts = await prisma.post.findMany({
      select: defaultPostSelector,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        visible: {
          equals: false,
        },
      },
    });
    return posts;
  }),
  createPost: protectedProcedure
    .input(
      z.object({
        body: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const { body } = input;

      const post = await prisma.post.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (post != null) {
        return false;
      }

      await prisma.post.create({
        data: {
          body,
          userId: user.id,
        },
      });
      return true;
    }),
  updatePost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        body: z.string(),
        visible: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, body, visible } = input;
      const user = ctx.session.user;

      const originalPost = await prisma.post.findUnique({
        where: {
          id,
        },
      });

      if (originalPost == null) {
        return false;
      }

      if (user.id !== originalPost.userId && user.role !== "ADMIN") {
        return false;
      }

      const isVisible = visible ?? true;

      await prisma.post.update({
        where: {
          id,
        },
        data: {
          body,
          visible: user.role === "ADMIN" ? isVisible : true,
        },
      });
      return true;
    }),
});

export type GetPostOutput = RouterOutputs["post"]["getPosts"];
export type GetProtectedPostOutput = RouterOutputs["post"]["getProtectedPosts"];

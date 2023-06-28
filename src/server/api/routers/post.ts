import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
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
  visible: true,
});

const postIdSelector = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  visible: true,
});

export const postRouter = createTRPCRouter({
  getPostIds: publicProcedure.query(async ({ ctx }) => {
    const role = ctx.session?.user.role;
    const id = ctx.session?.user.id;

    const visible = role !== "ADMIN";

    const postIds = await prisma.post.findMany({
      select: postIdSelector,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: {
          not: {
            equals: id,
          },
        },
      },
    });

    const filteredPostIds = postIds
      .filter((p) => p.visible === true || p.visible === visible)
      .map((p) => p.id);

    const usersPostId = await prisma.post.findFirst({
      select: postIdSelector,
      where: {
        userId: {
          equals: id,
        },
      },
    });

    const filteredUserPostid =
      usersPostId?.visible === true || usersPostId?.visible === visible
        ? usersPostId?.id
        : null;

    return { userPostId: filteredUserPostid, postIds: filteredPostIds };
  }),
  getPost: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const role = ctx.session?.user.role;
      const { id } = input;

      if (id == null) {
        return null;
      }

      const post = await prisma.post.findUnique({
        select: defaultPostSelector,
        where: {
          id,
        },
      });

      if (!post?.visible && role !== "ADMIN") {
        return null;
      }

      return post;
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

export type GetPostIdsOutput = RouterOutputs["post"]["getPostIds"];
export type GetPostOutput = RouterOutputs["post"]["getPost"];

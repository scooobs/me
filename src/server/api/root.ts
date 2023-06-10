import { createTRPCRouter } from "~/server/api/trpc";
import { sectionRouter } from "./routers/section";
import { cardRouter } from "./routers/card";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  section: sectionRouter,
  card: cardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

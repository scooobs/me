import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";
import { Post } from "./Post";
import type { User } from "@prisma/client";

export const Wall: React.FC = () => {
  const { data: session, status } = useSession();

  const { data: publicPosts } = api.post.getPosts.useQuery();
  const { data: protectedPosts } = api.post.getProtectedPosts.useQuery();

  const createPost = api.post.createPost.useMutation();

  const [showInvisiblePosts, setShowInvisiblePosts] =
    React.useState<boolean>(false);
  const [searchResult, setSearchResult] = React.useState<string>("");

  const notAuthenticated = React.useMemo(
    () => status === "unauthenticated",
    [status]
  );

  const [myPost, basePosts] = React.useMemo(() => {
    const derivedPublicPosts = publicPosts
      ? publicPosts
      : ([] as {
          user: User;
          id: string;
          body: string;
          createdAt: Date;
        }[]);
    const derivedProtectedPosts = protectedPosts
      ? protectedPosts
      : ([] as {
          user: User;
          id: string;
          body: string;
          createdAt: Date;
        }[]);
    const basePosts = showInvisiblePosts
      ? [...derivedPublicPosts, ...derivedProtectedPosts].sort(
          (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf()
        )
      : derivedPublicPosts;

    if (session == null) {
      return [undefined, basePosts];
    }

    return [
      basePosts.find((p) => p.user.id === session.user.id),
      basePosts.filter((p) => p.user.id != session.user.id),
    ];

    // TODO: Deep compare these objects to actually see if they've changed.
    // If i deep compare i need to store value in state and use these as loaders :<(
  }, [showInvisiblePosts, publicPosts, protectedPosts, session]);

  const filteredPosts = React.useMemo(() => {
    if (!searchResult) {
      return basePosts;
    }

    return basePosts.filter((b) =>
      b.user.name?.toLowerCase().includes(searchResult)
    );
    // TODO: Deep compare baseposts? Maybe not needed since basePosts should deep compare itself
  }, [basePosts, searchResult]);

  const posts = React.useMemo(() => {
    return filteredPosts.map((p) => <Post key={p.id} post={p} />);
  }, [filteredPosts]);

  if (notAuthenticated) {
    return (
      <div>
        <Link href={"/api/auth/signin"}>sign in</Link> to see this buckaroo
      </div>
    );
  }

  // Load Posts sorted by post date

  // If not signed in send to sign up

  // If I've posted show it first and allow me to edit it
  // else add an empty thing that lets me post

  // Don't allow me to post twice

  return (
    <div>
      {myPost && <Post key={myPost.id} post={myPost} />}
      {posts}
    </div>
  );
};

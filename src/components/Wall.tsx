import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";
import { Post } from "./Post";
import {
  type GetPostOutput,
  type GetProtectedPostOutput,
} from "~/server/api/routers/post";

export const Wall: React.FC = () => {
  const { data: session, status } = useSession();

  const { data: publicPosts } = api.post.getPosts.useQuery();
  const { data: protectedPosts } = api.post.getProtectedPosts.useQuery();

  const [showInvisiblePosts, setShowInvisiblePosts] =
    React.useState<boolean>(false);
  const [searchResult, setSearchResult] = React.useState<string>("");

  const notAuthenticated = React.useMemo(
    () => status === "unauthenticated",
    [status]
  );
  const isAdmin = React.useMemo(
    () => session?.user.role === "ADMIN",
    [session]
  );

  const [myPost, basePosts] = React.useMemo(() => {
    const derivedPublicPosts = publicPosts
      ? publicPosts
      : ([] as GetPostOutput);
    const derivedProtectedPosts = protectedPosts
      ? protectedPosts
      : ([] as GetProtectedPostOutput);
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

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((e) => {
      setSearchResult(e.target.value);
    }, []);

  const showInvisiblePostsOnClick: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback((_) => setShowInvisiblePosts((s) => !s), []);

  const controls = React.useMemo(() => {
    const filterPostColors = showInvisiblePosts
      ? "bg-green-400 shadow-green-300"
      : "bg-red-400 shadow-red-300";

    return (
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-1 flex-row gap-2 rounded-md bg-[#D9D9D9] bg-opacity-50 px-1 py-1">
          <span>🔍</span>
          <input
            className="flex-1 bg-transparent text-[#593E3E]  outline-none"
            onChange={onChangeHandler}
          />
        </div>
        {isAdmin && (
          <div
            onClick={showInvisiblePostsOnClick}
            className={
              "cursor-pointer rounded-full shadow-md " + filterPostColors
            }
          >
            👮‍♂️
          </div>
        )}
      </div>
    );
  }, [isAdmin, onChangeHandler, showInvisiblePosts, showInvisiblePostsOnClick]);

  if (notAuthenticated) {
    return (
      <div>
        <Link href={"/api/auth/signin"}>sign in</Link> to see this buckaroo
      </div>
    );
  }

  // todo: make prettier
  return (
    <div className="flex flex-col gap-4">
      {controls}
      {myPost ? <Post key={myPost.id} post={myPost} /> : <Post />}
      {posts}
    </div>
  );
};

import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";
import { Post } from "./Post";
import { useGlobalState } from "~/providers/StateProvider";

export const Wall: React.FC = () => {
  const { status } = useSession();
  const { state, setPartialState, isAdmin } = useGlobalState();
  const query = api.post.getPostIds.useQuery();

  const notAuthenticated = React.useMemo(
    () => status === "unauthenticated",
    [status]
  );

  const [myPostId, basePostIds] = React.useMemo(() => {
    const { data } = query;
    if (data == null) {
      return [undefined, [] as string[]];
    }

    return [data.userPostId, data.postIds];
  }, [query]);

  const posts = React.useMemo(() => {
    return basePostIds.map((id) => <Post key={id} postId={id} />);
  }, [basePostIds]);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        setPartialState({
          searchResult: e.target.value,
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

  const showInvisiblePostsOnClick: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback(
      (_) =>
        setPartialState({
          adminModeEnabled: !state.adminModeEnabled,
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [state.adminModeEnabled]
    );

  const controls = React.useMemo(() => {
    const filterPostColors = state.adminModeEnabled
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
  }, [
    isAdmin,
    onChangeHandler,
    showInvisiblePostsOnClick,
    state.adminModeEnabled,
  ]);

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
      <>
        {myPostId ? <Post key={myPostId} postId={myPostId} /> : <Post />}
        {posts}
      </>
    </div>
  );
};

import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import { formatDateString } from "~/utils/shared";
import { TextArea } from "./wrappers/TextArea";
import { z } from "zod";
import { useGlobalState } from "~/providers/StateProvider";

interface IPostProps {
  postId?: string;
}

const updatePostSchema = z.object({
  id: z.string(),
  body: z.string(),
  visible: z.boolean().optional(),
});

const createPostSchema = z.object({
  body: z.string(),
});

export const Post: React.FC<IPostProps> = ({ postId }) => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      if (post == null) {
        const formObject = createPostSchema.parse(
          Object.fromEntries(formData.entries())
        );
        createPost.mutate(formObject);
        return;
      }
      const formObject = updatePostSchema.parse(
        Object.fromEntries(formData.entries())
      );
      updatePost.mutate(formObject);
      setIsEditing(false);
    } catch (e) {
      // TODO: Add error checking / handling

      return;
    }
  }
  const { data: session } = useSession();
  const { state, isAdmin } = useGlobalState();
  const utils = api.useContext();

  const { data: post } = api.post.getPost.useQuery({ id: postId });
  const updatePost = api.post.updatePost.useMutation({
    onSuccess() {
      if (postId == null) {
        return;
      }
      utils.post.getPost
        .invalidate({ id: postId })
        .catch((e) => console.log(e));
      return;
    },
  });
  const createPost = api.post.createPost.useMutation();

  const isMyPost = React.useMemo(() => {
    if (session == null) {
      return false;
    }

    if (post == null) {
      return true;
    }

    return post.user.id == session.user.id;
  }, [post, session]);

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const hasBeenEdited = React.useMemo(() => {
    if (post == null) {
      return false;
    }
    return post.createdAt.valueOf() < post.updatedAt.valueOf();
  }, [post]);

  const canEdit = React.useMemo(() => {
    if (post == null) {
      return false;
    }
    return (
      (isAdmin && state.adminModeEnabled) || post.user.id === session?.user.id
    );
  }, [isAdmin, post, session?.user.id, state.adminModeEnabled]);

  const userColor = React.useMemo(() => {
    if (post == null) {
      return isAdmin ? "text-red-700" : "text-sky-700";
    }
    if (post.user.role === "ADMIN") {
      return "text-red-700";
    }
    if (isMyPost) {
      return "text-sky-700";
    }

    return "";
  }, [isAdmin, isMyPost, post]);

  const creatingPost = React.useMemo(() => {
    if (session == null) {
      return;
    }

    return (
      <>
        <div className="text-sm">
          <span className={userColor}>
            {session.user.name ?? "unknown user"}
          </span>
          <span>... cmon mate, leave a note!</span>
        </div>
        <TextArea
          name={"body"}
          className="ml-4 w-full border-0 bg-transparent outline-0"
          placeholder="right here!"
        />
        <button
          className="self-end text-xs font-semibold text-blue-600 opacity-70 hover:cursor-pointer hover:opacity-100"
          type="submit"
        >
          Post
        </button>
      </>
    );
  }, [session, userColor]);

  const notCreatingPost = React.useMemo(() => {
    if (post == null) {
      return;
    }

    const editButton = (
      <>
        <div />
        <span
          className="self-end text-xs opacity-70 hover:cursor-pointer hover:opacity-100"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </span>
      </>
    );

    const editingControls = (
      <>
        <button
          className="self-end text-xs font-semibold text-green-600 opacity-70 hover:cursor-pointer hover:opacity-100"
          type="submit"
        >
          Save
        </button>
        <div
          className="self-end text-xs font-semibold text-red-800 opacity-70 hover:cursor-pointer hover:opacity-100"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </div>
      </>
    );

    const timeMetadata = hasBeenEdited
      ? " edited " + formatDateString(post.updatedAt)
      : " posted " + formatDateString(post.createdAt);

    const uneditablePost = <div className="ml-4 text-base">{post.body}</div>;

    const editablePost = (
      <>
        <input type="hidden" name={"id"} value={post.id} />
        <TextArea
          name={"body"}
          className="ml-4 w-full border-0 bg-transparent outline-0"
          defaultValue={post.body}
        />
      </>
    );

    return (
      <>
        <div className="text-sm">
          <span className={userColor}>{post.user.name}</span>
          <span className="opacity-70">{timeMetadata}</span>
        </div>
        {isEditing ? editablePost : uneditablePost}
        {canEdit && (
          <div className="flex flex-row justify-between">
            {isEditing ? editingControls : editButton}
          </div>
        )}
      </>
    );
  }, [canEdit, hasBeenEdited, isEditing, post, userColor]);

  const shouldDisplay = React.useMemo(() => {
    if (post == null || !state.searchResult) {
      return true;
    }

    const { name } = post.user;

    if (name == null) {
      return false;
    }

    return name.toLowerCase().includes(state.searchResult.toLowerCase());
  }, [post, state.searchResult]);

  return shouldDisplay ? (
    <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
      {post == null ? creatingPost : notCreatingPost}
    </form>
  ) : (
    <></>
  );
};

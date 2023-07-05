import React from "react";
import { z } from "zod";
import { api } from "~/utils/api";

import { TextArea } from "./wrappers/TextArea";
import { useGlobalState } from "~/providers/StateProvider";
import { CardSkeleton } from "./skeletons/CardSkeleton";

interface ICardProps {
  id: string;
}

const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  subTitle: z.string(),
  body: z.string(),
});

export const Card: React.FC<ICardProps> = ({ id }) => {
  const { isAdmin } = useGlobalState();

  const { data: cardData, isLoading } = api.card.getCard.useQuery({
    id,
  });
  const mutation = api.card.updateCard.useMutation();

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isHovering, setIsHovering] = React.useState<boolean>(false);

  const title = React.useMemo(
    () => (cardData && cardData.card ? cardData.card.title : ""),
    [cardData]
  );
  const subTitle = React.useMemo(
    () => (cardData && cardData.card?.subTitle ? cardData.card.subTitle : ""),
    [cardData]
  );
  const body = React.useMemo(
    () => (cardData && cardData.card ? cardData.card.body : ""),
    [cardData]
  );

  const enableEditing = (
    <>
      <div />
      <div
        className="self-end text-xs opacity-70 hover:cursor-pointer hover:opacity-100"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </div>
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

  const editingPopup = (
    <div className="flex flex-row justify-between">
      {isEditing ? editingControls : isHovering && enableEditing}
    </div>
  );

  const uneditableCard = (
    <>
      <div className="text-sm font-semibold ">{title}</div>
      <div className="mt-1 text-xs opacity-70">{subTitle}</div>
      <div className="mt-2 text-sm">{body}</div>
    </>
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formObject = formSchema.parse(Object.fromEntries(formData.entries()));
    mutation.mutate(formObject);
    setIsEditing(false);
  }

  const editableCard = (
    <>
      <input type="hidden" name={"id"} value={id} />
      <TextArea
        name={"title"}
        className="border-0 bg-transparent text-sm font-semibold outline-0"
        defaultValue={title}
      />
      <TextArea
        name={"subTitle"}
        className="mt-1 border-0 bg-transparent text-xs opacity-70 outline-0"
        defaultValue={subTitle}
      />
      <TextArea
        name={"body"}
        className="mt-2 border-0 bg-transparent text-sm outline-0"
        defaultValue={body}
      />
    </>
  );

  return isLoading ? (
    <CardSkeleton />
  ) : (
    <form
      className="flex flex-1 flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onSubmit={handleSubmit}
    >
      {isAdmin && editingPopup}
      {isEditing ? editableCard : uneditableCard}
    </form>
  );
};

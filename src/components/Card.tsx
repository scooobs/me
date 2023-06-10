import { useSession } from "next-auth/react";
import React from "react";
import { z } from "zod";
import type { CardSelectionType } from "~/server/api/routers/section";
import { api } from "~/utils/api";
import { TextArea } from "./wrappers/TextArea";

interface ICardProps {
  card: CardSelectionType;
}

const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  subTitle: z.string(),
  body: z.string(),
});

export const Card: React.FC<ICardProps> = ({ card }) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isHovering, setIsHovering] = React.useState<boolean>(false);
  const mutation = api.card.updateCard.useMutation();

  const canEdit = React.useMemo(
    () => session?.user.role === "ADMIN",
    [session]
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
      <div className="text-sm font-semibold ">{card.title}</div>
      <div className="text-xs opacity-70">{card.subTitle}</div>
      <div className="pt-2 text-sm">{card.body}</div>
    </>
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formObject = formSchema.parse(Object.fromEntries(formData.entries()));
    mutation.mutate(formObject);
  }

  const editableCard = (
    <>
      <input type="hidden" name={"id"} value={card.id} />
      <TextArea
        name={"title"}
        className="border-0 bg-transparent text-sm font-semibold outline-0"
        defaultValue={card.title}
      />
      <TextArea
        name={"subTitle"}
        className="border-0 bg-transparent text-xs opacity-70 outline-0"
        defaultValue={card.subTitle}
      />
      <TextArea
        name={"body"}
        className="border-0 bg-transparent pt-2 text-sm outline-0"
        defaultValue={card.body}
      />
    </>
  );

  return (
    <form
      className="flex flex-1 flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onSubmit={handleSubmit}
    >
      {canEdit && editingPopup}
      {isEditing ? editableCard : uneditableCard}
    </form>
  );
};

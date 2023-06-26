import React from "react";

export const TextArea: React.FC<
  Omit<React.HTMLProps<HTMLTextAreaElement>, "ref" | "onChange">
> = (props) => {
  const refCallback: React.RefCallback<HTMLTextAreaElement> = React.useCallback(
    (e) => {
      if (e == null) {
        return;
      }
      e.style.height = "0";
      e.style.height = e.scrollHeight.toString() + "px";
    },
    []
  );

  const onChangeCallback: React.ChangeEventHandler<HTMLTextAreaElement> =
    React.useCallback((e) => {
      e.target.style.height = "0";
      e.target.style.height = e.target.scrollHeight.toString() + "px";
    }, []);

  return <textarea {...props} ref={refCallback} onChange={onChangeCallback} />;
};

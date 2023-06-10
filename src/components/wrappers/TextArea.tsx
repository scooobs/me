import React from "react";

export const TextArea: React.FC<
  Omit<React.HTMLProps<HTMLTextAreaElement>, "ref" | "onChange">
> = (props) => (
  <textarea
    {...props}
    ref={(e) => {
      if (e == null) {
        return;
      }
      e.style.height = 0;
      e.style.height = e.scrollHeight.toString() + "px";
    }}
    onChange={(e) => {
      e.target.style.height = 0;
      e.target.style.height = e.target.scrollHeight.toString() + "px";
    }}
  />
);

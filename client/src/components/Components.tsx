import React from "react";
import { Input } from "@material-ui/core";
import { EMPTY_PLACEHOLDER } from "../constants";

export function TextInputField({
  elementId,
  text,
  setState,
  type,
  fullWidth,
}: {
  elementId?: string;
  text: string;
  setState?: (value: string) => void;
  type?: string;
  fullWidth?: boolean;
}) {
  const DEFAULT_TYPE = "text";

  const onTextChange = (e: React.FocusEvent<HTMLInputElement>) => {
    if (setState) {
      setState(e.target.value);
    }
  };

  return (
    <Input
      id={elementId ? elementId : ""}
      type={type ? type : DEFAULT_TYPE}
      fullWidth={fullWidth}
      placeholder={text ? text : EMPTY_PLACEHOLDER}
      onBlur={onTextChange}
    />
  );
}

import React from "react";
import { Input } from "@material-ui/core";
import { EMPTY_PLACEHOLDER } from "../constants";

export function TextInputField({
  text,
  setState,
  type,
  fullWidth,
}: {
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
      type={type ? type : DEFAULT_TYPE}
      fullWidth={fullWidth}
      placeholder={text ? text : EMPTY_PLACEHOLDER}
      onBlur={onTextChange}
    />
  );
}

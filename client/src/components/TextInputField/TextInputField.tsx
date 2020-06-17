import React from "react";
import { Input } from "@material-ui/core";
import { EMPTY_PLACEHOLDER } from "src/constants";

function TextInputField({
  id,
  text,
  setState,
  type,
  fullWidth,
}: {
  id?: string;
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
      id={id ? id : undefined}
      type={type ? type : DEFAULT_TYPE}
      fullWidth={fullWidth}
      placeholder={text ? text : EMPTY_PLACEHOLDER}
      onBlur={onTextChange}
    />
  );
}

export default TextInputField;

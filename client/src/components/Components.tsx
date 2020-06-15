import React, { useEffect, useState } from "react";
import { Input } from "@material-ui/core";
import { ID_PLACEHOLDER } from "../constants";

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
  const onTextChange = (e: React.FocusEvent<HTMLInputElement>) => {
    if (setState) {
      setState(e.target.value);
    }
  };
  return (
    <Input
      type={type ? type : "text"}
      fullWidth={fullWidth}
      placeholder={text ? text : ID_PLACEHOLDER}
      onBlur={onTextChange}
    />
  );
}

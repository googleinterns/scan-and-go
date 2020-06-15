import React, { useEffect, useState } from "react";
import { Input } from "@material-ui/core";
import { ID_PLACEHOLDER } from "../constants";

export function TextInputField({
  text,
  setState,
}: {
  text: string;
  setState: (value: string) => void;
}) {
  const onTextChange = (e: React.FocusEvent<HTMLInputElement>) => {
    setState(e.target.value);
  };
  return (
    <Input placeholder={text ? text : ID_PLACEHOLDER} onBlur={onTextChange} />
  );
}

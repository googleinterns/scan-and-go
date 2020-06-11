import React, { useEffect, useState } from "react";
import { Input } from "@material-ui/core";

export function TextInputField({
  text, 
  callback
}: {
  text: string,
  callback: (value: string) => void
}) {
  const onTextChange = (e: React.FocusEvent<HTMLInputElement>) => {
    callback(e.target.value);
  };
  return (
    <Input
      placeholder={text ? text : "...id"}
      onBlur={onTextChange}
    />
  );
}

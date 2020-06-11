import React, { useEffect, useState } from "react";
import { Input } from "@material-ui/core";

export function TextInputField(props: any) {
  const onTextChange = (e: any) => {
    props.callback(e.target.value);
  };
  return (
    <Input
      placeholder={props.text ? props.text : "...id"}
      onBlur={onTextChange}
    />
  );
}

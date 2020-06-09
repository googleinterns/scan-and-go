import React, { useEffect, useState } from "react";
import { Input } from "@material-ui/core";

export function TextInputField(props: any) {
  const onTextChange = (e: any) => {
    if (props.callback instanceof Function) {
      props.callback(e.target.value);
    }
  };
  return (
    <Input
      type={props.type}
      fullWidth={props.fullWidth}
      placeholder={props.text ? props.text : "...id"}
      onBlur={onTextChange}
    />
  );
}

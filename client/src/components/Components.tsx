import React, { useEffect, useState } from "react";

export function TextInputField(props: any) {
  const onTextChange = (e: any) => {
    props.callback(e.target.value);
  };
  return (
    <input
      type="text"
      placeholder={props.text ? props.text : "...id"}
      onBlur={onTextChange}
    />
  );
}

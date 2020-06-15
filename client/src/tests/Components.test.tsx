import React from "react";
import renderer from "react-test-renderer";
import { TextInputField } from "./../components/Components";

it("TextInputField renders correctly", () => {
  let state: string = "";
  const props = {
    text: "",
    setState: (value: string) => {
      state = value;
    },
  };
  const tree = renderer.create(<TextInputField {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

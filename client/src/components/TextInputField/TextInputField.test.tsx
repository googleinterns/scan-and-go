import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import TextInputField from "./TextInputField";
import { Input } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

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

it("TextInputField fires callback when input is blurred", () => {
  let state: string = "";
  const props = {
    text: "",
    setState: (value: string) => {
      state = value;
    },
  };
  const wrapper = Enzyme.shallow(<TextInputField {...props} />);
  const input = wrapper.find(Input);
  input.simulate("blur", { target: { value: "Hello" } });
  expect(state.match("Hello"));
});

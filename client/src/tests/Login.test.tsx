import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Login from "./../pages/Login";
import { Input } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

it("Login Page renders correctly", () => {
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("Login Page redirects given valid user", async () => {
  const validUser = "Admin";
  const mountedWrapper = Enzyme.mount(<Login />);
  const input = mountedWrapper.find("#username").last();
  Object.defineProperty(window, "location", {
    writable: true,
    value: { assign: jest.fn() },
  });
  input.simulate("blur", { target: { value: validUser } });
  expect(window.location.assign).toBeCalledWith("/home");
});

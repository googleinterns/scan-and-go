import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Login from "./Login";
import { Input } from "@material-ui/core";
import * as constants from "./../constants/index";
import { isWeb, microapps } from "./../constants/index";

Enzyme.configure({ adapter: new Adapter() });

Object.defineProperty(window, "location", {
  writable: true,
  value: { assign: jest.fn() },
});

it("Login Page renders web UI correctly", () => {
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("Login Page redirects on web given valid user", () => {
  const validUser = "Admin";
  const mountedWrapper = Enzyme.mount(<Login />);
  const input = mountedWrapper.find("#username").last();
  input.simulate("blur", { target: { value: validUser } });
  expect(window.location.assign).toBeCalledWith("/home");
});

it("Login Page renders microapps UI correctly", () => {
  // Set isWeb to true to render web UI
  const origIsWeb = constants.isWeb;
  constants.isWeb = false;
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
  constants.isWeb = origIsWeb;
});

it("Login Page calls microapps Identity API to login", async () => {
  // Interject our definitions for constant variables
  const origIsWeb = constants.isWeb;
  constants.isWeb = false;
  const origMicroapps = constants.microapps;
  constants.microapps = global.microapps;
  // We should automatically call Login function
  // and interact with microapps API on mount
  const microappsIdentityAPI = jest.spyOn(global.microapps, "getIdentity");
  // Mount our Component after mocking API call
  const mountedWrapper = Enzyme.mount(<Login />);
  expect(microappsIdentityAPI).toHaveBeenCalledTimes(1);
  // After Login is called and we sent over a valid identity
  // we should expect a url redirect
  await waitFor(() => expect(window.location.assign).toBeCalledWith("/home"));
  // Reinstate our original global values to avoid side effects
  constants.isWeb = origIsWeb;
  constants.microapps = origMicroapps;
});

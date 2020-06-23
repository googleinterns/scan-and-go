import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Login from "./Login";
import { Input } from "@material-ui/core";
import * as config from "src/config";
import { isWeb, microapps } from "src/config";

Enzyme.configure({ adapter: new Adapter() });

describe("Test on Web UI", () => {
  const origIsWeb = config.isWeb;

  beforeAll(() => {
    config.isWeb = true;
  });

  afterAll(() => {
    config.isWeb = origIsWeb;
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
    expect(global.mockRedirectPush).toBeCalledWith("/home");
  });
});

describe("Simulate test within GPay Env", () => {
  const origIsWeb = config.isWeb;
  const origMicroapps = config.microapps;

  beforeAll(() => {
    config.isWeb = false;
    config.microapps = global.microapps;
  });

  afterAll(() => {
    config.isWeb = origIsWeb;
    config.microapps = origMicroapps;
  });

  it("Login Page renders microapps UI correctly", async () => {
    const tree = renderer.create(<Login />).toJSON();
    await waitFor(() => expect(tree).toMatchSnapshot());
  });

  it("Login Page calls microapps Identity API to login", async () => {
    // We should automatically call Login function
    // and interact with microapps API on mount
    const microappsIdentityAPI = jest.spyOn(global.microapps, "getIdentity");
    const mountedWrapper = Enzyme.mount(<Login />);
    expect(microappsIdentityAPI).toHaveBeenCalledTimes(1);
    // After Login is called and we sent over a valid identity
    // we should expect a url redirect
    await waitFor(() =>
      expect(global.mockRedirectPush).toBeCalledWith("/home")
    );
  });
});

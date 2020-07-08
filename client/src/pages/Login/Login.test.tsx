import React from "react";
import { waitFor, waitForElement } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Login from "./Login";
import * as config from "src/config";
import { isWeb, microapps } from "src/config";
import { HOME_PAGE, RECEIPT_PAGE } from "src/constants";
import { AuthContext } from "src/contexts/AuthContext";
import { User } from "src/interfaces";
import TestRenderer from "react-test-renderer";
import * as router from "react-router-dom";
import { useHistory } from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

describe("Test on Web UI", () => {
  const origIsWeb = config.isWeb;

  beforeAll(() => {
    config.isWeb = true;
  });

  afterAll(() => {
    config.isWeb = origIsWeb;
  });

  it("Login Page renders web UI correctly", async () => {
    let tree;
    await TestRenderer.act(async () => {
      tree = renderer.create(<Login />).toJSON();
    });
    expect(tree).toMatchSnapshot();
  });

  it("Login Page on web redirects to home page by default, given valid user", async () => {
    const validUser = "Admin";
    const useContextMockReturnValue = {
      user: {
        name: validUser,
        "user-id": "",
      },
      setUser: (user: User) => {},
      unsetUser: () => {},
    };

    // Wrap Login in the context provider to inject a value for testing https://stackoverflow.com/questions/54691799/how-to-test-a-react-component-that-is-dependent-on-usecontext-hook
    const element = TestRenderer.create(
      <AuthContext.Provider value={useContextMockReturnValue}>
        <Login />
      </AuthContext.Provider>
    );
    await TestRenderer.act(async () => {
      TestRenderer.create(
        <AuthContext.Provider value={useContextMockReturnValue}>
          <Login />
        </AuthContext.Provider>
      );
    });
    const pushArgs = await waitFor(() => global.mockRedirectPush.mock.calls[0]);
    expect(pushArgs[0]).toHaveProperty("pathname", HOME_PAGE);
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
    await waitFor(() => {
      const pushArgs = global.mockRedirectPush.mock.calls[0];
      expect(pushArgs[0]).toHaveProperty("pathname", HOME_PAGE);
    });
  });
});

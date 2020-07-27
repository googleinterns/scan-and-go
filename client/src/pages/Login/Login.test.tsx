import React from "react";
import renderer, { act } from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Login from "./Login";
import * as config from "src/config";
import { isWeb, microapps } from "src/config";
import { HOME_PAGE, TEST_USER } from "src/constants";
import { AuthContext } from "src/contexts/AuthContext";
import { User, emptyUser } from "src/interfaces";
import TestRenderer from "react-test-renderer";
import { useHistory } from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

// Mock auth context
const mockAuthContext = {
  user: TEST_USER,
  setUser: (user: User) => {},
  unsetUser: () => {},
};

describe("Test on Web UI", () => {
  // Set and unset isWeb variable for testing
  const origIsWeb = config.isWeb;

  beforeAll(() => {
    config.isWeb = true;
  });

  afterAll(() => {
    config.isWeb = origIsWeb;
  });

  it("Login Page renders web UI correctly", async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<Login />).toJSON();
    });
    expect(tree).toMatchSnapshot();
  });

  it("Login Page redirects to home page by default, given valid user", async () => {
    // Wrap Login in the context provider to inject a value for testing https://stackoverflow.com/questions/54691799/how-to-test-a-react-component-that-is-dependent-on-usecontext-hook
    await act(async () => {
      TestRenderer.create(
        <AuthContext.Provider value={mockAuthContext}>
          <Login />
        </AuthContext.Provider>
      );
    });
    const pushArgs = global.mockRedirectPush.mock.calls.pop();
    expect(pushArgs[0]).toHaveProperty("pathname", HOME_PAGE);
  });

  it("Login Page redirects to previous page, given valid user", async () => {
    // Mock location from previous page
    const previousPage = "PREVIOUS_PAGE";
    useHistory.mockImplementationOnce(() => {
      return {
        push: global.mockRedirectPush,
        location: {
          state: { from: { pathname: previousPage } },
        },
      };
    });

    await act(async () => {
      TestRenderer.create(
        <AuthContext.Provider value={mockAuthContext}>
          <Login />
        </AuthContext.Provider>
      );
    });
    const pushArgs = global.mockRedirectPush.mock.calls.pop();
    expect(pushArgs[0]).toHaveProperty("pathname", previousPage);
  });

  it("Login Page stays on page, given invalid user", async () => {
    mockAuthContext.user = emptyUser();
    await act(async () => {
      TestRenderer.create(
        <AuthContext.Provider value={mockAuthContext}>
          <Login />
        </AuthContext.Provider>
      );
    });
    expect(global.mockRedirectPush).toHaveBeenCalledTimes(0);
    mockAuthContext.user = TEST_USER;
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
    let tree;
    await act(async () => {
      tree = renderer.create(<Login />).toJSON();
    });
    expect(tree).toMatchSnapshot();
  });

  it("Login Page calls microapps Identity API to login", async () => {
    // We should automatically call Login function
    // and interact with microapps API on mount
    const microappsIdentityAPI = jest.spyOn(global.microapps, "getIdentity");
    await act(async () => {
      TestRenderer.create(
        <AuthContext.Provider value={mockAuthContext}>
          <Login />
        </AuthContext.Provider>
      );
    });
    expect(microappsIdentityAPI).toHaveBeenCalledTimes(1);
    // After Login is called and we sent over a valid identity
    // we should expect a url redirect
    const pushArgs = global.mockRedirectPush.mock.calls[0];
    expect(pushArgs[0]).toHaveProperty("pathname", HOME_PAGE);
  });
});

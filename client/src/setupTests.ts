import { useHistory } from "react-router-dom";
import { TEST_USER } from "./constants";

// Mocking GPay Microapps API
global.microapps = {
  getIdentity: (request: any) =>
    new Promise((resolve, reject) => {
      const fakeIdentity = {
        iss: "", // Issuer Identification
        sub: TEST_USER["user-id"], // Unique identifier for google account
        aud: "", // Audience response is intended for
        iat: -1, // Time token is issued (Unix int seconds)
        exp: 0, // Token expiry time (Unix int seconds)
        name: TEST_USER.name,
      };
      const fakeEncodedResponse =
        btoa(JSON.stringify({})) + "." + btoa(JSON.stringify(fakeIdentity));
      resolve(fakeEncodedResponse);
    }),
  requestMedia: () => {
    //TODO(#96) Implement mocked media API
  },
  getLocation: () => {
    //TODO(#97) Implement mocked location API
  },
};

// Capture react-router-dom useHistory hook
// push function for url redirects
global.mockRedirectPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn(),
}));
useHistory.mockImplementation(() => ({
  push: global.mockRedirectPush,
}));

// Try to capture the zxing scanner call to verify
// we are reaching here
jest.mock("@zxing/library", () => ({
  ...jest.requireActual("@zxing/library"),
  BrowserMultiFormatReader: function () {
    return {
      // We simply return the image src data passed to us
      // in tests, we will write plaintext instead of image
      // bytes into our img src field
      decodeFromImage: (imgElement: HTMLImageElement) =>
        new Promise((resolve, reject) => {
          resolve({
            text: imgElement.src,
          });
        }),
    };
  },
}));

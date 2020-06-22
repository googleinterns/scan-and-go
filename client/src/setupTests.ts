// Mocking GPay Microapps API
global.microapps = {
  getIdentity: (request: any) =>
    new Promise((resolve, reject) => {
      const fakeIdentity = {
        iss: "", // Issuer Identification
        sub: "faked API Identity", // Unique identifier for google account
        aud: "", // Audience response is intended for
        iat: -1, // Time token is issued (Unix int seconds)
        exp: 0, // Token expiry time (Unix int seconds)
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

// Capturing window.location.assign function
Object.defineProperty(window, "location", {
  writable: true,
  value: { assign: jest.fn() },
});

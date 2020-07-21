// Mock any middlewares before creating the express server
// so that express stores a reference to the mocked module
// https://stackoverflow.com/questions/58831968/simple-way-to-test-middleware-in-express-without-creating-recreating-server/58834073#58834073
// https://stackoverflow.com/questions/41995464/how-to-mock-middleware-in-express-to-skip-authentication-for-unit-test
jest.mock("./authentication", () => ({
  ...jest.requireActual("./authentication"),
  authUser: jest.fn(),
}));
jest.mock("google-auth-library");

import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import UserHeader from "./UserHeader";
import { User } from "src/interfaces";

Enzyme.configure({ adapter: new Adapter() });

describe("UserHeader Component Tests", () => {
  const TEST_USER: User = {
    name: "TEST_USER",
    "user-id": "TEST",
  };

  it("UserHeader renders correctly", () => {
    const tree = renderer.create(<UserHeader user={TEST_USER} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

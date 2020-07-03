import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AlertBoxQueued from "./AlertBoxQueued";

Enzyme.configure({ adapter: new Adapter() });

describe("AlertBoxQueued Component Tests", () => {
  const props = {};

  it("AlertBoxQueued renders correctly", () => {
    const tree = renderer.create(<AlertBoxQueued {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

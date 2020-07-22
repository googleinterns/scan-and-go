import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AutoSizeMedia from "./AutoSizeMedia";

Enzyme.configure({ adapter: new Adapter() });

describe("AutoSizeMedia Component Tests", () => {
  const props = {};

  it("AutoSizeMedia renders correctly", () => {
    const tree = renderer.create(<AutoSizeMedia {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

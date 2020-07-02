import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MediaScanner from "./MediaScanner";

Enzyme.configure({ adapter: new Adapter() });

describe("MediaScanner Component Tests", () => {
  const props = {};

  it("MediaScanner renders correctly", () => {
    const tree = renderer.create(<MediaScanner {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ItemCardCompact from "./ItemCardCompact";

Enzyme.configure({ adapter: new Adapter() });

describe("ItemCardCompact Component Tests", () => {
  const props = {};

  it("ItemCardCompact renders correctly", () => {
    const tree = renderer.create(<ItemCardCompact {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

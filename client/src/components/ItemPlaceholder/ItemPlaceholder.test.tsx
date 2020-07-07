import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ItemPlaceholder from "./ItemPlaceholder";

Enzyme.configure({ adapter: new Adapter() });

describe("ItemPlaceholder Component Tests", () => {
  const props = {};

  it("ItemPlaceholder renders correctly", () => {
    const tree = renderer.create(<ItemPlaceholder {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

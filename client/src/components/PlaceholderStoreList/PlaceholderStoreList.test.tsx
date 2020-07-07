import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PlaceholderStoreList from "./PlaceholderStoreList";

Enzyme.configure({ adapter: new Adapter() });

describe("PlaceholderStoreList Component Tests", () => {
  const props = {};

  it("PlaceholderStoreList renders correctly", () => {
    const tree = renderer.create(<PlaceholderStoreList {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
